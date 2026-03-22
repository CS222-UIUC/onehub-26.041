import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import { Post } from '@/types'

async function getRecentPosts(): Promise<Post[]> {
  const { data } = await supabase
    .from('posts')
    .select('*, club:clubs(*)')
    .order('timestamp', { ascending: false })
    .limit(6)
  return (data as Post[]) ?? []
}

export default async function HomePage() {
  const posts = await getRecentPosts()

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="UIUC Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="watercolor-overlay absolute inset-0" />
        <div className="relative z-10 text-center px-6 space-y-6 max-w-2xl mx-auto">
          <h1 className="text-6xl font-bold tracking-tight drop-shadow-lg">
            one<span style={{ color: '#ffb347' }}>hub</span>
          </h1>
          <p className="text-xl text-white/90 font-light leading-relaxed drop-shadow">
            Every UIUC club. One feed. Stay in the loop.
          </p>
          <div className="flex gap-4 justify-center pt-2">
            <Link
              href="/feed"
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--uiuc-orange)', color: 'white' }}
            >
              explore feed <ArrowRight size={16} />
            </Link>
            <Link
              href="/clubs"
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold glass-card transition-all hover:scale-105"
              style={{ color: 'white' }}
            >
              view clubs
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="max-w-6xl mx-auto w-full px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--uiuc-blue)' }}>
            latest posts
          </h2>
          <Link
            href="/feed"
            className="flex items-center gap-1 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'var(--uiuc-orange)' }}
          >
            see all <ArrowRight size={14} />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No posts yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
