import { Club } from '@/types'

export const CLUBS: Omit<Club, 'id' | 'created_at'>[] = [
  {
    name: 'Disruption Lab',
    handle: 'uiuc_disruption',
    category: 'tech',
    avatar_url: null,
    bio: 'UIUC\'s innovation and disruption community.',
    instagram_url: 'https://www.instagram.com/uiuc_disruption/',
    website_url: null,
  },
  {
    name: 'Illinois Business Consulting',
    handle: 'illinoisbusinessconsulting',
    category: 'business',
    avatar_url: null,
    bio: 'Student-run consulting organization at UIUC.',
    instagram_url: 'https://www.instagram.com/illinoisbusinessconsulting/',
    website_url: null,
  },
  {
    name: 'Build Illinois',
    handle: 'buildillinois',
    category: 'engineering',
    avatar_url: null,
    bio: 'Building the future at UIUC.',
    instagram_url: 'https://www.instagram.com/buildillinois/',
    website_url: null,
  },
  {
    name: 'Founders UIUC',
    handle: 'illinoisfounders',
    category: 'entrepreneurship',
    avatar_url: null,
    bio: 'Entrepreneurship community at UIUC.',
    instagram_url: 'https://www.instagram.com/illinoisfounders/',
    website_url: null,
  },
  {
    name: 'ACM @ UIUC',
    handle: 'acm.uiuc',
    category: 'cs',
    avatar_url: null,
    bio: 'UIUC\'s hub for everything CS. 19 SIGs, 50+ years of history.',
    instagram_url: 'https://www.instagram.com/acm.uiuc/',
    website_url: 'https://www.acm.illinois.edu',
  },
]

export const CATEGORY_LABELS: Record<string, string> = {
  tech: 'Tech',
  business: 'Business',
  engineering: 'Engineering',
  entrepreneurship: 'Entrepreneurship',
  cs: 'Computer Science',
  other: 'Other',
}

export const CATEGORY_COLORS: Record<string, string> = {
  tech: 'bg-blue-100 text-blue-800',
  business: 'bg-orange-100 text-orange-800',
  engineering: 'bg-green-100 text-green-800',
  entrepreneurship: 'bg-purple-100 text-purple-800',
  cs: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-800',
}
