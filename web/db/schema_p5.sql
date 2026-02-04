-- Create Enum for User Roles
create type public.user_role as enum ('admin', 'user');

-- Create Profiles Table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  role public.user_role default 'user'::public.user_role,
  email text,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant permissions (if needed, but public schema usually has them)
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
