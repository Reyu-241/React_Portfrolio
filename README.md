# Personal Portfolio

A personal portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS, and Supabase.

## Setup

1. Install Node.js (LTS).
2. Copy `.env.example` to `.env.local` and add your Supabase project values when ready.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open `http://localhost:3000`.

## Animated background

The homepage combines two visual layers to create a space-themed design:

- **Galaxy background:** The React Bits [Galaxy background](https://reactbits.dev/backgrounds/galaxy)
  is rendered as a full-screen WebGL animation behind the page. It creates a
  dynamic field of stars that moves gently and reacts to the user's pointer. The
  Galaxy component is configured in `app/page.tsx` and is implemented in
  `components/Galaxy.jsx`.
- **Animated planet:** In the hero section, a decorative planet is built with
  CSS. It uses a radial gradient, soft glow, atmospheric bands, and floating
  animations to create the appearance of a planet. Elliptical orbit lines and
  twinkling stars complete the scene.

The Galaxy remains fixed while the page scrolls, while the planet belongs to
the hero section and moves with the content. The planet animation includes a
small vertical floating effect, and the surrounding stars gently change
opacity and scale. These animations are located in `app/globals.css`.

## Supabase schema and access

Apply the SQL files in `supabase/migrations/` to your Supabase project in
filename order. Then, in the Supabase SQL Editor, configure the one allowed
project editor by replacing the UUID below with your user ID from Supabase Auth:

```sql
insert into private.portfolio_settings (singleton, owner_id)
values (true, 'YOUR_SUPABASE_AUTH_USER_UUID')
on conflict (singleton)
do update set owner_id = excluded.owner_id;
```

Without this configuration, portfolio content edits are denied. Published
projects are readable without signing in. The configured owner can create, edit,
or delete projects. Contact submissions allow anonymous inserts, but only the
configured owner can read them. The database enforces a honeypot field, input
length limits, and a limit of three submissions per email address in 15 minutes.
The contact form should submit an empty `website` field as its honeypot. For
stronger production spam protection, add CAPTCHA and/or rate limiting at the
API or edge layer; email-based database limits can be bypassed with different
addresses.

To sign in to the admin area, disable public sign-ups in Supabase Auth settings,
create or invite your owner account, add its user UUID to
`private.portfolio_settings` using the SQL above, and open `/admin/login`. Use
the account's email and password; successful sign-in opens `/admin/projects`.
The admin navigation includes project and case-study editors, blog management,
and the contact-message inbox. Only the configured owner can change projects,
case studies, or blog posts, or read contact submissions. Never put a Supabase
service-role key in client-side code.

## Deployment

This project uses Next.js App Router and can be deployed to Vercel from the repository.
Vercel should use the `npm run build` build command; `package-lock.json` keeps the
dependency versions consistent between local builds and deployments.

Admin-managed blog articles are stored in Supabase and can be created as drafts,
published, edited, and deleted at `/admin/blog`. Case-study content and blog
records are protected by row-level security. The `/edit` tools and their
write APIs are development-only and save local Markdown files under
`content/blog/`.

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

The portfolio homepage, blog, resume, and admin editors use the Next.js App
Router. Supabase Auth protects portfolio content management and the
contact-message inbox. The public contact form is still under development.
