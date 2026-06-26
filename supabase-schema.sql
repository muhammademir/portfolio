-- Jalankan SQL ini di Supabase Dashboard > SQL Editor

-- Tabel projects
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  tech_stack text[] default '{}',
  category text not null check (category in ('web', 'iot', 'design', 'mobile')),
  image_url text,
  github_url text,
  case_study_url text,
  demo_url text,
  created_at timestamptz default now()
);

-- Tabel experiences
create table if not exists experiences (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company text not null,
  type text not null check (type in ('internship', 'freelance', 'fulltime')),
  location text not null,
  start_date text not null,
  end_date text,
  is_current boolean default false,
  description text not null,
  tech_stack text[] default '{}',
  created_at timestamptz default now()
);

-- Tabel certificates
create table if not exists certificates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  issuer text not null,
  year text not null,
  image_url text,
  pdf_url text,
  created_at timestamptz default now()
);

-- Aktifkan RLS (Row Level Security)
alter table projects enable row level security;
alter table experiences enable row level security;
alter table certificates enable row level security;

-- Policy: siapa saja bisa READ (untuk halaman publik)
create policy "Public read projects" on projects for select using (true);
create policy "Public read experiences" on experiences for select using (true);
create policy "Public read certificates" on certificates for select using (true);

-- Policy: hanya service_role yang bisa INSERT/UPDATE/DELETE (dari admin panel)
-- Ini sudah otomatis dengan service role key, tidak perlu policy tambahan

-- Storage bucket untuk file upload
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
on conflict do nothing;

-- Policy storage: siapa saja bisa READ file
create policy "Public read storage" on storage.objects for select using (bucket_id = 'portfolio');

-- Policy storage: hanya authenticated yang bisa upload
create policy "Auth upload storage" on storage.objects for insert with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');
create policy "Auth delete storage" on storage.objects for delete using (bucket_id = 'portfolio' and auth.role() = 'authenticated');
