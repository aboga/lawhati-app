-- لوحتي: Supabase Free database schema
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  username text not null default '',
  email text not null default '',
  role text not null default 'user' check (role in ('teacher','student','admin','user')),
  avatar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.boards (
  id text primary key,
  owner_id text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists boards_owner_id_idx on public.boards(owner_id);

create table if not exists public.posts (
  id text primary key,
  board_id text not null references public.boards(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_board_id_idx on public.posts(board_id);

-- Profile creation trigger for future users.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, username, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name',''), coalesce(new.raw_user_meta_data->>'username',''), coalesce(new.email,''), coalesce(new.raw_user_meta_data->>'role','user'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Storage bucket used by the server. The server uses the service role, so these
-- policies are intentionally restrictive; browser clients do not write directly.
insert into storage.buckets (id, name, public)
values ('lawhati-files', 'lawhati-files', false)
on conflict (id) do nothing;
