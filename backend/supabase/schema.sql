create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamp with time zone default now()
);
