'use client'

import { Search, X } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/clubs'

interface FilterBarProps {
  search: string
  category: string
  club: string
  clubs: { id: string; name: string; handle: string }[]
  onSearch: (v: string) => void
  onCategory: (v: string) => void
  onClub: (v: string) => void
}

export default function FilterBar({
  search, category, club, clubs, onSearch, onCategory, onClub,
}: FilterBarProps) {
  const hasFilters = search || category || club

  const inputStyle = {
    backgroundColor: 'var(--surface)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'white',
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition placeholder:text-white/30"
          style={inputStyle}
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className="text-sm px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
          style={inputStyle}
        >
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={club}
          onChange={(e) => onClub(e.target.value)}
          className="text-sm px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
          style={inputStyle}
        >
          <option value="">All clubs</option>
          {clubs.map((c) => (
            <option key={c.id} value={c.handle}>{c.name}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => { onSearch(''); onCategory(''); onClub('') }}
            className="flex items-center gap-1 text-sm transition-colors hover:text-white"
            style={{ color: 'var(--muted)' }}
          >
            <X size={14} /> clear
          </button>
        )}
      </div>
    </div>
  )
}
