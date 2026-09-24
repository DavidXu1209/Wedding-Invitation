-- Replace YOUR_SUPABASE_AUTH_EMAIL_HERE with the admin email used on admin.html.
-- First send and open a magic link so that this email has a row in auth.users.
begin;

alter table public.blessings enable row level security;

revoke update, delete on table public.blessings from anon, authenticated;
grant select, insert on table public.blessings to anon, authenticated;
grant delete on table public.blessings to authenticated;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
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
    alter table public.blessings
      add constraint blessings_name_length_check
      check (name is not null and char_length(btrim(name)) between 1 and 12);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.blessings'::regclass
      and conname = 'blessings_message_length_check'
  ) then
    alter table public.blessings
      add constraint blessings_message_length_check
      check (message is not null and char_length(btrim(message)) between 1 and 36);
  end if;
end;
$$;

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"blessing_admin"}'::jsonb
where lower(email) = lower('YOUR_SUPABASE_AUTH_EMAIL_HERE');

do $$
begin
  if not exists (
    select 1 from auth.users
    where lower(email) = lower('YOUR_SUPABASE_AUTH_EMAIL_HERE')
      and raw_app_meta_data ->> 'role' = 'blessing_admin'
  ) then
    raise exception 'Admin Auth user not found. Sign in with the magic link first and replace the email placeholder.';
  end if;
end;
$$;

create policy blessings_public_read
  on public.blessings for select to anon, authenticated
  using (true);

create policy blessings_public_insert
  on public.blessings for insert to anon, authenticated
  with check (
    name is not null and char_length(btrim(name)) between 1 and 12
    and message is not null and char_length(btrim(message)) between 1 and 36
  );

create policy blessings_admin_delete
  on public.blessings for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'blessing_admin');

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'blessings'
  ) then
    execute 'alter publication supabase_realtime add table public.blessings';
  end if;
end;
$$;

commit;
