'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'home' },
  { href: '/feed', label: 'feed' },
  { href: '/clubs', label: 'clubs' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#003C7D]">
        <span className="text-lg font-bold" style={{ color: '#E84A27' }}>o</span>
      </Link>

      {/* Center pill nav */}
      <div className="flex items-center gap-1 bg-[#1e2130] rounded-full px-2 py-2">
        {links.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Right placeholder to balance layout */}
      <div className="w-10 h-10 rounded-full bg-[#1e2130] flex items-center justify-center">
        <span className="text-gray-400 text-sm">✦</span>
      </div>
    </nav>
  )
}
