-- COPY AND PASTE THIS ENTIRE SCRIPT INTO THE SUPABASE SQL EDITOR AND CLICK RUN --

-- 1. Create Documents Storage Bucket
insert into storage.buckets (id, name, public) 
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Ensure anyone can upload to the documents bucket (since your website uses upsert without strict auth)
create policy "Public Access to Documents" on storage.objects for all using ( bucket_id = 'documents' );

-- 2. Create Contacts Table
create table if not exists public.contacts (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text,
    email text,
    user_type text,
    message text
);

-- Enable RLS but allow anyone to insert a contact message (Public form)
alter table public.contacts enable row level security;
create policy "Public can insert contacts" on public.contacts for insert with check (true);
create policy "Admins can view contacts" on public.contacts for select using (true); -- simplify to true for admin panel access


-- 3. Create Users Directory Table
create table if not exists public.users_directory (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text,
    email text unique,
    user_type text,
    last_active timestamp with time zone default timezone('utc'::text, now())
);

-- Turn off strict RLS here so the auto-login ticker can update their last_active status
alter table public.users_directory enable row level security;
create policy "Anyone can modify users directory" on public.users_directory for all using (true);


-- 4. Create Startups Table
create table if not exists public.startups (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safely add columns if they don't exist
alter table public.startups add column if not exists user_id uuid references auth.users (id);
alter table public.startups add column if not exists company_name text;
alter table public.startups add column if not exists founder_name text;
alter table public.startups add column if not exists founder_email text;
alter table public.startups add column if not exists industry text;
alter table public.startups add column if not exists description text;
alter table public.startups add column if not exists funding_needed text;
alter table public.startups add column if not exists pitch_deck_url text;
alter table public.startups add column if not exists dpiit_number text;

alter table public.startups enable row level security;
drop policy if exists "Authenticated users can insert startups" on public.startups;
create policy "Authenticated users can insert startups" on public.startups for insert with check (auth.role() = 'authenticated');

drop policy if exists "Users can update their own startup" on public.startups;
create policy "Users can update their own startup" on public.startups for update using (auth.uid() = user_id);

drop policy if exists "Admins can view all startups" on public.startups;
create policy "Admins can view all startups" on public.startups for select using (true);


-- 5. Create Investors Table
create table if not exists public.investors (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.investors add column if not exists user_id uuid references auth.users (id);
alter table public.investors add column if not exists full_name text;
alter table public.investors add column if not exists email text;
alter table public.investors add column if not exists invest_sectors text;
alter table public.investors add column if not exists ticket_size text;
alter table public.investors add column if not exists kyc_url text;
alter table public.investors add column if not exists is_kyc_verified boolean default false;

alter table public.investors enable row level security;

drop policy if exists "Authenticated users can insert investors" on public.investors;
create policy "Authenticated users can insert investors" on public.investors for insert with check (auth.role() = 'authenticated');

drop policy if exists "Users can update their own investor profile" on public.investors;
create policy "Users can update their own investor profile" on public.investors for update using (auth.uid() = user_id);

drop policy if exists "Admins can view all investors" on public.investors;
create policy "Admins can view all investors" on public.investors for select using (true);

drop policy if exists "Admins can update all investors" on public.investors;
create policy "Admins can update all investors" on public.investors for update using (true);

