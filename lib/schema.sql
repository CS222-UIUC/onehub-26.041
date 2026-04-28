-- clubs table
create table if not exists clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  handle text unique not null,
  category text not null,
  avatar_url text,
  bio text,
  instagram_url text not null,
  website_url text,
  created_at timestamptz default now()
);

-- posts table
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  image_url text,
  caption text,
  likes integer default 0,
  post_url text unique not null,
  timestamp timestamptz not null,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- indexes for fast filtering/search
create index if not exists posts_club_id_idx on posts(club_id);
create index if not exists posts_timestamp_idx on posts(timestamp desc);
create index if not exists posts_tags_idx on posts using gin(tags);
