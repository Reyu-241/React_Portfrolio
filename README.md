# Personal Portfolio

A personal portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS, and Supabase.

## Setup

1. Install Node.js (LTS).
2. Copy `.env.example` to `.env.local` and add your Supabase project values when ready.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open `http://localhost:3000`.

## Animated background

The homepage uses [animated-backgrounds](https://github.com/umerfarok/animated-backgrounds)
to show an interactive starry-night animation behind the page content.

## Supabase schema and access

Apply `supabase/migrations/20261027120000_portfolio_rls.sql` to your Supabase
project. Then, in the Supabase SQL Editor, configure the one allowed project
editor by replacing the UUID below with your user ID from Supabase Auth:

```sql
insert into private.portfolio_settings (singleton, owner_id)
values (true, 'YOUR_SUPABASE_AUTH_USER_UUID')
on conflict (singleton)
do update set owner_id = excluded.owner_id;
```

Without this configuration, project edits are denied. Published projects are
readable without signing in; only the configured owner can create, edit, or
delete projects. Contact submissions allow anonymous inserts only, with no
public read access. The database also enforces a honeypot field, input length
limits, and a limit of three submissions per email address in 15 minutes.
The contact form should submit an empty `website` field as its honeypot.

## Deployment

This project uses Next.js App Router and can be deployed to Vercel from the repository.
Vercel should use the `npm run build` build command; `package-lock.json` keeps the
dependency versions consistent between local builds and deployments.

Blog articles are Markdown files in `content/blog/` with frontmatter for
`date`, `title`, `tagline`, `preview`, and optional `image`. They are read from
the repository and included when Vercel builds the site. The `/edit` tools and
their write APIs are development-only; production content changes require a
repository commit and redeployment.

```md
---
date: 2026-10-25
title: Article title
tagline: A short subtitle
preview: A short description for the blog index and search engines.
image: ""
---

Write the article body in Markdown.
```

Live URL: _Add after deployment._

## AI tool disclosure

AI was used as a coding partner to spot errors, suggest ways to fix them, and
help write or improve code where needed. Changes were reviewed and tested as
part of development.

## Project status

The portfolio homepage, blog, resume, and local development editors use the
Next.js App Router. The Supabase schema and access policies are defined, but
the contact form, authenticated admin workflow, and application database
integration still need to be connected before those features are available.
