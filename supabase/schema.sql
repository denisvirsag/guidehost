-- GuideHost Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  plan_status text check (plan_status in ('active', 'canceled', 'past_due', 'trialing')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- PROPERTIES
-- ============================================
create table public.properties (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  address text,
  cover_image_url text,
  slug text unique not null,
  wifi_name text,
  wifi_password text,
  check_in_time text,
  check_out_time text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for properties
alter table public.properties enable row level security;

create policy "Users can manage their own properties"
  on public.properties for all
  using (auth.uid() = owner_id);

-- ============================================
-- GUIDES
-- ============================================
create table public.guides (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Guida della mia proprietà',
  published boolean not null default false,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  accent_color text not null default '#FF5A5F',
  views_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for guides
alter table public.guides enable row level security;

create policy "Users can manage their own guides"
  on public.guides for all
  using (auth.uid() = owner_id);

create policy "Anyone can view published guides"
  on public.guides for select
  using (published = true);

-- ============================================
-- GUIDE SECTIONS
-- ============================================
create table public.guide_sections (
  id uuid default uuid_generate_v4() primary key,
  guide_id uuid references public.guides(id) on delete cascade not null,
  type text not null check (type in (
    'welcome', 'wifi', 'checkin', 'rules', 'how_to',
    'map', 'recommendations', 'emergency', 'faq',
    'gallery', 'checkout_checklist', 'custom'
  )),
  title text not null,
  content jsonb not null default '{}',
  icon text,
  "order" integer not null default 0,
  visible boolean not null default true
);

-- RLS for guide sections
alter table public.guide_sections enable row level security;

create policy "Guide owner can manage sections"
  on public.guide_sections for all
  using (
    exists (
      select 1 from public.guides
      where guides.id = guide_sections.guide_id
      and guides.owner_id = auth.uid()
    )
  );

create policy "Anyone can view sections of published guides"
  on public.guide_sections for select
  using (
    exists (
      select 1 from public.guides
      where guides.id = guide_sections.guide_id
      and guides.published = true
    )
  );

-- ============================================
-- GUIDE VIEWS (analytics)
-- ============================================
create table public.guide_views (
  id uuid default uuid_generate_v4() primary key,
  guide_id uuid references public.guides(id) on delete cascade not null,
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  country text
);

-- RLS for guide views
alter table public.guide_views enable row level security;

create policy "Anyone can insert a view"
  on public.guide_views for insert
  with check (true);

create policy "Guide owner can view analytics"
  on public.guide_views for select
  using (
    exists (
      select 1 from public.guides
      where guides.id = guide_views.guide_id
      and guides.owner_id = auth.uid()
    )
  );

-- Function to increment views count
create or replace function public.increment_guide_views(guide_id_param uuid)
returns void as $$
begin
  update public.guides
  set views_count = views_count + 1
  where id = guide_id_param;
end;
$$ language plpgsql security definer;

-- Indexes for performance
create index idx_properties_owner on public.properties(owner_id);
create index idx_guides_property on public.guides(property_id);
create index idx_guides_owner on public.guides(owner_id);
create index idx_guide_sections_guide on public.guide_sections(guide_id);
create index idx_guide_sections_order on public.guide_sections(guide_id, "order");
create index idx_guide_views_guide on public.guide_views(guide_id);
create index idx_guide_views_date on public.guide_views(guide_id, viewed_at);
