create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create table private.portfolio_settings (
  singleton boolean primary key default true check (singleton),
  owner_id uuid references auth.users (id) on delete restrict
);

revoke all on table private.portfolio_settings from public, anon, authenticated;

create or replace function private.is_portfolio_owner()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, private
as $$
  select exists (
    select 1
    from private.portfolio_settings
    where singleton = true
      and owner_id = (select auth.uid())
  );
$$;

revoke all on function private.is_portfolio_owner() from public;
grant execute on function private.is_portfolio_owner() to anon, authenticated;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = btrim(slug) and length(slug) between 1 and 160),
  title text not null check (title = btrim(title) and length(title) between 1 and 200),
  description text not null default '',
  image_url text,
  project_url text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Published projects are publicly readable"
on public.projects
for select
to anon, authenticated
using (is_published or (select private.is_portfolio_owner()));

create policy "Portfolio owner can insert projects"
on public.projects
for insert
to authenticated
with check ((select private.is_portfolio_owner()));

create policy "Portfolio owner can update projects"
on public.projects
for update
to authenticated
using ((select private.is_portfolio_owner()))
with check ((select private.is_portfolio_owner()));

create policy "Portfolio owner can delete projects"
on public.projects
for delete
to authenticated
using ((select private.is_portfolio_owner()));

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

create or replace function private.set_project_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger set_project_updated_at
before update on public.projects
for each row
execute function private.set_project_updated_at();

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (name = btrim(name) and length(name) between 1 and 120),
  email text not null check (
    email = btrim(email)
    and length(email) between 3 and 254
    and position('@' in email) > 1
  ),
  message text not null check (
    message = btrim(message)
    and length(message) between 1 and 5000
  ),
  website text not null default '' check (website = ''),
  created_at timestamptz not null default now()
);

create index contact_submissions_email_created_at_idx
on public.contact_submissions (lower(email), created_at desc);

alter table public.contact_submissions enable row level security;

create policy "Anyone can submit a contact message"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

grant insert (name, email, message, website)
on public.contact_submissions to anon, authenticated;

create or replace function private.check_contact_submission()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  recent_submissions integer;
begin
  if new.website <> '' then
    raise exception 'Contact submission rejected';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(lower(new.email), 0));

  select count(*)
  into recent_submissions
  from public.contact_submissions
  where lower(email) = lower(new.email)
    and created_at >= now() - interval '15 minutes';

  if recent_submissions >= 3 then
    raise exception 'Contact submission rate limit exceeded';
  end if;

  return new;
end;
$$;

revoke all on function private.check_contact_submission() from public, anon, authenticated;

create trigger check_contact_submission
before insert on public.contact_submissions
for each row
execute function private.check_contact_submission();
