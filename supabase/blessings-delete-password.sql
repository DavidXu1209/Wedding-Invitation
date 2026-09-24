-- Replace the placeholder with your chosen password before running this file.
begin;

create extension if not exists pgcrypto with schema extensions;
create schema if not exists wedding_private;
revoke usage on schema wedding_private from public, anon, authenticated;

create table if not exists wedding_private.blessing_delete_config (
  singleton boolean primary key default true check (singleton),
  password_hash text not null
);
alter table wedding_private.blessing_delete_config enable row level security;
revoke all on wedding_private.blessing_delete_config from public, anon, authenticated;

do $$
declare
  chosen_password text := $password$YOUR_CHOSEN_DELETE_PASSWORD_HERE$password$;
begin
  if chosen_password like 'YOUR_CHOSEN_%' or chosen_password = '' then
    raise exception 'Replace the password placeholder before running this script.';
  end if;

  insert into wedding_private.blessing_delete_config (singleton, password_hash)
  values (true, extensions.crypt(chosen_password, extensions.gen_salt('bf', 12)))
  on conflict (singleton) do update
  set password_hash = excluded.password_hash;
end;
$$;

alter table public.blessings enable row level security;
revoke update, delete on table public.blessings from public, anon, authenticated;
grant select, insert on table public.blessings to anon, authenticated;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'blessings'
  loop
    execute format('drop policy %I on public.blessings', existing_policy.policyname);
  end loop;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.blessings'::regclass
      and conname = 'blessings_name_length_check'
  ) then
    alter table public.blessings add constraint blessings_name_length_check
      check (name is not null and char_length(btrim(name)) between 1 and 12);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.blessings'::regclass
      and conname = 'blessings_message_length_check'
  ) then
    alter table public.blessings add constraint blessings_message_length_check
      check (message is not null and char_length(btrim(message)) between 1 and 36);
  end if;
end;
$$;

create policy blessings_public_read on public.blessings
  for select to anon, authenticated using (true);
create policy blessings_public_insert on public.blessings
  for insert to anon, authenticated with check (
    name is not null and char_length(btrim(name)) between 1 and 12
    and message is not null and char_length(btrim(message)) between 1 and 36
  );

create or replace function public.delete_blessing_with_password(target_id text, provided_password text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  stored_hash text;
begin
  select c.password_hash into stored_hash
  from wedding_private.blessing_delete_config as c
  where c.singleton = true;

  if stored_hash is null or provided_password is null
     or extensions.crypt(provided_password, stored_hash) <> stored_hash then
    return false;
  end if;

  delete from public.blessings as b where b.id::text = target_id;
  return found;
end;
$$;

revoke all on function public.delete_blessing_with_password(text, text) from public;
grant execute on function public.delete_blessing_with_password(text, text) to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'blessings'
  ) then
    execute 'alter publication supabase_realtime add table public.blessings';
  end if;
end;
$$;

commit;
