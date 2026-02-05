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
declare
  v_invite_code text;
  v_role public.user_role;
begin
  -- Extract invite code from metadata
  v_invite_code := new.raw_user_meta_data->>'invite_code';
  v_role := 'user'::public.user_role; -- Default role

  -- If invite code exists, mark it as used and get its role
  if v_invite_code is not null then
    -- Check if code exists and get its role
    SELECT role::public.user_role INTO v_role 
    FROM public.invite_codes 
    WHERE code = v_invite_code 
    AND used = false;

    if v_role is not null then
      update public.invite_codes
      set used = true,
          used_by = new.id,
          used_at = now()
      where code = v_invite_code;
    else
      v_role := 'user'::public.user_role;
    end if;
  end if;

  -- Insert into profiles with the determined role
  insert into public.profiles (id, email, role)
  values (new.id, new.email, v_role)
  on conflict (id) do update 
  set role = EXCLUDED.role,
      email = EXCLUDED.email;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant permissions (if needed, but public schema usually has them)
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
