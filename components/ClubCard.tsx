'use client'

import { useRouter } from 'next/navigation'
import { Link2, Globe } from 'lucide-react'
import { Club } from '@/types'
import { CATEGORY_LABELS } from '@/lib/clubs'

export default function ClubCard({ club }: { club: Club }) {
  const router = useRouter()

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 space-y-3 cursor-pointer"
      style={{ backgroundColor: 'var(--surface)' }}
      onClick={() => router.push(`/clubs/${club.handle}`)}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ backgroundColor: 'var(--uiuc-blue)' }}
        >
          {club.name[0]}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate">{club.name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white/60" style={{ backgroundColor: 'var(--surface-2)' }}>
            {CATEGORY_LABELS[club.category]}
          </span>
        </div>
      </div>

      {club.bio && (
        <p className="text-sm line-clamp-2" style={{ color: 'var(--muted)' }}>{club.bio}</p>
      )}

      <div className="flex gap-3 pt-1">
        <a
          href={club.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs transition-colors hover:text-white"
          style={{ color: 'var(--muted)' }}
        >
          <Link2 size={13} /> Instagram
        </a>
        {club.website_url && (
          <a
            href={club.website_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs transition-colors hover:text-white"
            style={{ color: 'var(--muted)' }}
          >
            <Globe size={13} /> Website
          </a>
        )}
      </div>
    </div>
  )
}
