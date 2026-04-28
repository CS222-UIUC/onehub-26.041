import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const maxDuration = 300

const APIFY_BASE = 'https://api.apify.com/v2'
const ACTOR_ID = 'apify~instagram-scraper'

function autoTag(caption: string): string[] {
  const tags: string[] = []
  if (/event|workshop|talk|panel|session|meetup|info session/i.test(caption)) tags.push('event')
  if (/recruit|apply|application|join|hiring|position|role/i.test(caption)) tags.push('recruitment')
  if (/deadline|due|submit|last chance/i.test(caption)) tags.push('deadline')
  if (/social|hang|chill|fun|game/i.test(caption)) tags.push('social')
  if (/congrat|award|winner|first place/i.test(caption)) tags.push('achievement')
  return tags
}

async function startRun(instagramUrl: string): Promise<string> {
  const token = process.env.APIFY_API_TOKEN
  const res = await fetch(`${APIFY_BASE}/acts/${ACTOR_ID}/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      directUrls: [instagramUrl],
      resultsType: 'posts',
      resultsLimit: 12,
    }),
  })
  const json = await res.json()
  return json.data.id as string
}

async function waitForRun(runId: string, timeoutMs = 240000): Promise<string> {
  const token = process.env.APIFY_API_TOKEN
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 5000))
    const res = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${token}`)
    const json = await res.json()
    const { status, defaultDatasetId } = json.data
    if (status === 'SUCCEEDED') return defaultDatasetId as string
    if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
      throw new Error(`Run ${runId} ended with status: ${status}`)
    }
  }
  throw new Error(`Run ${runId} timed out`)
}

async function fetchDataset(datasetId: string): Promise<Record<string, unknown>[]> {
  const token = process.env.APIFY_API_TOKEN
  const res = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${token}&limit=12`)
  return res.json()
}

async function scrapeClub(clubId: string, instagramUrl: string): Promise<number> {
  const runId = await startRun(instagramUrl)
  const datasetId = await waitForRun(runId)
  const items = await fetchDataset(datasetId)
  const db = supabaseAdmin()

  let count = 0
  for (const item of items) {
    const caption = (item.caption as string) ?? ''
    const { error } = await db.from('posts').upsert({
      club_id: clubId,
      image_url: item.displayUrl ?? null,
      caption: caption || null,
      likes: item.likesCount ?? 0,
      post_url: `https://www.instagram.com/p/${item.shortCode}/`,
      timestamp: item.timestamp,
      tags: autoTag(caption),
    }, { onConflict: 'post_url' })
    if (!error) count++
  }
  return count
}

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()
  const { data: clubRows } = await db.from('clubs').select('id, handle, instagram_url')
  if (!clubRows) return NextResponse.json({ error: 'No clubs found' }, { status: 500 })

  const tasks = clubRows.map(async (club) => {
    try {
      const count = await scrapeClub(club.id, club.instagram_url)
      return [club.handle, count] as const
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`Failed scraping ${club.handle}:`, msg)
      return [club.handle, -1] as const
    }
  })

  const settled = await Promise.allSettled(tasks)
  const results = Object.fromEntries(
    settled.map((r) => r.status === 'fulfilled' ? r.value : ['unknown', -1])
  )

  return NextResponse.json({ success: true, results })
}
