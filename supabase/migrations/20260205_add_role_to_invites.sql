-- Add role to invite_codes
ALTER TABLE public.invite_codes ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Update trigger function to assign role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
declare
  v_invite_code text;
  v_role text;
begin
  -- Extract invite code from metadata
  v_invite_code := new.raw_user_meta_data->>'invite_code';
  v_role := 'user'; -- Default role

  -- If invite code exists, mark it as used and get its role
  if v_invite_code is not null then
    -- Check if code exists and get its role
    SELECT role INTO v_role 
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
      -- If the code was not found or already used, we don't change v_role here (it stays 'user')
      v_role := 'user';
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
$$;
