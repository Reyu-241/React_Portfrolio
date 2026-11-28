create table public.case_studies (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.case_studies enable row level security;

create policy "Case studies are publicly readable"
on public.case_studies
for select
to anon, authenticated
using (true);

create policy "Portfolio owner can manage case studies"
on public.case_studies
for all
to authenticated
using ((select private.is_portfolio_owner()))
with check ((select private.is_portfolio_owner()));

revoke all on table public.case_studies from public, anon, authenticated;
grant select on public.case_studies to anon, authenticated;
grant insert, update, delete on public.case_studies to authenticated;

create table public.blog_posts (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  date timestamptz not null,
  title text not null check (title = btrim(title) and length(title) between 1 and 200),
  tagline text not null default '',
  preview text not null default '',
  image text not null default '',
  content text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_published_date_idx
on public.blog_posts (date desc)
where is_published;

alter table public.blog_posts enable row level security;

create policy "Published blog posts are publicly readable"
on public.blog_posts
for select
to anon, authenticated
using (is_published or (select private.is_portfolio_owner()));

create policy "Portfolio owner can manage blog posts"
on public.blog_posts
for all
to authenticated
using ((select private.is_portfolio_owner()))
with check ((select private.is_portfolio_owner()));

revoke all on table public.blog_posts from public, anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

create or replace function private.set_content_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.set_content_updated_at() from public, anon, authenticated;

create trigger set_case_studies_updated_at
before update on public.case_studies
for each row
execute function private.set_content_updated_at();

create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function private.set_content_updated_at();

insert into public.case_studies (slug, content)
values
  (
    'pokedex',
    jsonb_build_object(
      'number', '01',
      'title', 'Pokedex',
      'summary', 'A Pokemon project built with JavaScript, CSS, and HTML.',
      'description', 'A browser-based project exploring how JavaScript, HTML, and CSS work together to create a Pokemon experience.',
      'technologies', jsonb_build_array('JavaScript', 'CSS', 'HTML'),
      'repository', 'https://github.com/Reyu-241/Pokedex',
      'screenshots', jsonb_build_array(
        jsonb_build_object(
          'src', '/images/projects/pokedex-1.png',
          'alt', 'Pokemon of South Africa page with filters and Pokemon cards.',
          'caption', 'Browse and filter Pokemon',
          'width', 1542,
          'height', 840
        ),
        jsonb_build_object(
          'src', '/images/projects/pokedex-2.png',
          'alt', 'Pokemon team builder with selected Pokemon, move selectors, and stats.',
          'caption', 'Build a team and choose moves',
          'width', 1157,
          'height', 827
        )
      ),
      'sections', jsonb_build_array(
        jsonb_build_object(
          'heading', 'Project overview',
          'description', 'Pokedex is a frontend project centered on the Pokemon universe, built with core web technologies.'
        ),
        jsonb_build_object(
          'heading', 'Implementation',
          'description', 'JavaScript brings the project behavior together, while HTML and CSS provide the structure and presentation.'
        ),
        jsonb_build_object(
          'heading', 'What I learned',
          'description', 'This project provided hands-on practice combining browser fundamentals into a complete, shareable project.'
        )
      )
    )
  ),
  (
    'yellow-game',
    jsonb_build_object(
      'number', '02',
      'title', 'Yellow Game',
      'summary', 'A game project built with Python and HTML.',
      'description', 'A game project that combines Python and HTML, bringing programming practice together with a web-based interface.',
      'technologies', jsonb_build_array('Python', 'HTML'),
      'repository', 'https://github.com/Reyu-241/Yellow-Game',
      'sections', jsonb_build_array(
        jsonb_build_object(
          'heading', 'Project overview',
          'description', 'Yellow Game is a game project built with Python and HTML.'
        ),
        jsonb_build_object(
          'heading', 'Implementation',
          'description', 'The project brings together Python code and HTML, giving me practice working across both technologies.'
        ),
        jsonb_build_object(
          'heading', 'What I learned',
          'description', 'Building this project helped me explore how different technologies can contribute to one cohesive experience.'
        )
      )
    )
  ),
  (
    'clinic-dashboard',
    jsonb_build_object(
      'number', '03',
      'title', 'Clinic Operations Dashboard',
      'summary', 'A clinic dashboard for patient records, appointments, treatments, and operational insights.',
      'description', 'A clinic management app that helps a small clinic owner manage patient records and appointments, with charts to track patient growth and appointment status.',
      'technologies', jsonb_build_array('Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'),
      'repository', 'https://github.com/Reyu-241/clinic-dashboard',
      'screenshots', jsonb_build_array(
        jsonb_build_object(
          'src', '/images/projects/clinic-1.png',
          'alt', 'Clinic appointment booking form with patient and appointment details.',
          'caption', 'Book a clinic appointment',
          'width', 705,
          'height', 852
        ),
        jsonb_build_object(
          'src', '/images/projects/clinic-2.png',
          'alt', 'Clinic dashboard showing patient and appointment summaries, charts, and quick links.',
          'caption', 'Review clinic activity and appointment status',
          'width', 1882,
          'height', 845
        )
      ),
      'sections', jsonb_build_array(
        jsonb_build_object(
          'heading', 'The challenge',
          'description', 'Clinic owners need a clear way to manage patient records and appointments, and to understand appointment status and patient growth.'
        ),
        jsonb_build_object(
          'heading', 'The solution',
          'description', 'The dashboard brings patient, appointment, and treatment records together. Its charts summarize new patients over six months and the current month''s appointment statuses.'
        ),
        jsonb_build_object(
          'heading', 'Privacy and access',
          'description', 'Authentication and user-scoped data access help keep clinic records isolated. The project is intended for fictional demo data, not real patient information.'
        )
      )
    )
  )
on conflict (slug) do nothing;
