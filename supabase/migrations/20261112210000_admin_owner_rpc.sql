create or replace function public.is_portfolio_owner()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, private
as $$
  select private.is_portfolio_owner();
$$;

revoke all on function public.is_portfolio_owner() from public, anon, authenticated;
grant execute on function public.is_portfolio_owner() to authenticated;
