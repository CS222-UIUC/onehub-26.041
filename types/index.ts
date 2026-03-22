export type Category = 'tech' | 'business' | 'engineering' | 'entrepreneurship' | 'cs' | 'other'

export interface Club {
  id: string
  name: string
  handle: string
  category: Category
  avatar_url: string | null
  bio: string | null
  instagram_url: string
  website_url: string | null
  created_at: string
}

export interface Post {
  id: string
  club_id: string
  image_url: string | null
  caption: string | null
  likes: number | null
  post_url: string
  timestamp: string
  tags: string[]
  created_at: string
  club?: Club
}
