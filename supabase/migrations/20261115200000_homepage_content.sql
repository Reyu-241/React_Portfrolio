create table if not exists public.homepage_content (
  id boolean primary key default true check (id),
  content jsonb not null
);

alter table public.homepage_content enable row level security;

drop policy if exists "Homepage content is publicly readable"
on public.homepage_content;
create policy "Homepage content is publicly readable"
on public.homepage_content
for select
to anon, authenticated
using (true);

drop policy if exists "Portfolio owner can manage homepage content"
on public.homepage_content;
create policy "Portfolio owner can manage homepage content"
on public.homepage_content
for all
to authenticated
using ((select private.is_portfolio_owner()))
with check ((select private.is_portfolio_owner()));

revoke all on table public.homepage_content from public, anon, authenticated;
grant select on public.homepage_content to anon, authenticated;
grant insert, update on public.homepage_content to authenticated;
