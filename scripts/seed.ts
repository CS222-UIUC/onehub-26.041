import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import { CLUBS } from '../lib/clubs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  console.log('Seeding clubs...')

  const { data, error } = await supabase
    .from('clubs')
    .upsert(CLUBS, { onConflict: 'handle' })
    .select()

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`✓ Seeded ${data.length} clubs:`)
  data.forEach((c) => console.log(`  - ${c.name} (@${c.handle})`))
}

seed()
