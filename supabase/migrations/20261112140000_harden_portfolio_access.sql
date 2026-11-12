revoke all on table public.projects from public, anon, authenticated;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

revoke all on table public.contact_submissions from public, anon, authenticated;
grant insert (name, email, message, website)
on public.contact_submissions to anon, authenticated;
grant select on public.contact_submissions to authenticated;

drop policy if exists "Portfolio owner can read contact submissions"
on public.contact_submissions;

create policy "Portfolio owner can read contact submissions"
on public.contact_submissions
for select
to authenticated
using ((select private.is_portfolio_owner()));
