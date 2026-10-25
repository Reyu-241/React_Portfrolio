# Personal Portfolio

A personal portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS, and Supabase.

## Setup

1. Install Node.js (LTS).
2. Copy `.env.example` to `.env.local` and add your Supabase project values when ready.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open `http://localhost:3000`.

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

_Add a short description of how AI tools were used while building this project._

## Project status

The portfolio homepage, blog, resume, and local development editors use the
Next.js App Router. Contact handling, authentication, and database access are
still placeholders and need to be implemented before those features are
available in production.
