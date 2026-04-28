import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { ApifyClient } from 'apify-client'

const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN })

async function test() {
  console.log('Starting Apify scrape for acm.uiuc...')
  try {
    const run = await client.actor('apify/instagram-scraper').call({
      directUrls: ['https://www.instagram.com/acm.uiuc/'],
      resultsType: 'posts',
      resultsLimit: 3,
    }, { waitSecs: 120 })

    console.log('Run status:', run.status)
    const { items } = await client.dataset(run.defaultDatasetId).listItems()
    console.log(`Got ${items.length} posts`)
    if (items[0]) {
      console.log('Sample post:', {
        shortCode: items[0].shortCode,
        caption: (items[0].caption as string)?.slice(0, 80),
        displayUrl: items[0].displayUrl ? 'yes' : 'no',
        timestamp: items[0].timestamp,
      })
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

test()
