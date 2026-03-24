'use client'

import Image from 'next/image'
import Link from 'next/link'
import { User, Share2, Calendar } from 'lucide-react'
import { Post } from '@/types'

interface PostCardProps {
  post: Post
  showClub?: boolean
}

function proxyUrl(url: string) {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`
}

export default function PostCard({ post, showClub = true }: PostCardProps) {
  const club = post.club
  const date = new Date(post.timestamp)
  const dateLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })

  const handleShare = async () => {
    try {
      await navigator.share({ url: post.post_url, title: club?.name })
    } catch {
      await navigator.clipboard.writeText(post.post_url)
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--surface)' }}>
      {/* Image with date badge */}
      <Link href={post.post_url} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full aspect-[4/3]">
          {post.image_url ? (
            <Image
              src={proxyUrl(post.image_url)}
              alt={post.caption?.slice(0, 60) ?? 'Post'}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-2)' }}>
              <span className="text-4xl font-bold opacity-20">{club?.name[0]}</span>
            </div>
          )}
          {/* Date badge */}
          <div className="absolute top-3 left-3 bg-white text-gray-900 text-xs font-bold px-2.5 py-1 rounded-lg">
            {dateLabel}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title / caption */}
        <h3 className="text-white font-bold text-base leading-snug line-clamp-2 font-mono">
          {post.caption?.split('\n')[0] ?? 'New Post'}
        </h3>

        {/* Club handle */}
        {showClub && club && (
          <Link href={`/clubs/${club.handle}`} className="flex items-center gap-1.5 w-fit group">
            <User size={13} style={{ color: 'var(--uiuc-orange)' }} />
            <span className="text-sm font-medium group-hover:underline" style={{ color: 'var(--uiuc-orange)' }}>
              @{club.handle}
            </span>
          </Link>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-medium text-white/70" style={{ backgroundColor: 'var(--surface-2)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleShare}
            className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors hover:opacity-80"
            style={{ backgroundColor: 'var(--surface-2)' }}
          >
            <Share2 size={15} className="text-white/70" />
          </button>
          <Link
            href={post.post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--uiuc-orange)', color: 'white' }}
          >
            <Calendar size={14} />
            View post
          </Link>
        </div>
      </div>
    </div>
  )
}
