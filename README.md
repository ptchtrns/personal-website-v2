> ⚠️ This is currently work in progress

# Personal Website v2

Personal website and media repository: an about-me / portfolio page (work
experience, education, projects), a photo and audio gallery, a contact form, and
an admin dashboard for managing all of the above.

Built with [Fresh](https://fresh.deno.dev) (Deno, Preact, Tailwind CSS v4),
deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/).
Pages are server-rendered; client-side JavaScript is limited to a handful of
interactive islands (galleries, carousels, admin forms).

## Stack

- **Runtime/framework**: Deno + Fresh 2 (Vite plugin), Preact
- **Styling**: Tailwind CSS v4, shadcn-style UI components
- **Database**: Cloudflare D1 (SQLite) via Drizzle ORM
- **Storage**: Cloudflare R2 for media files (photos, audio, PDFs)
- **Auth**: a single admin account, password checked against `ADMIN_PASSWORD`
  and a JWT session stored in a cookie
- **Email**: Resend, for contact-form submissions
- **Validation**: zod, on every form/API input

## Getting started

Install [Deno](https://docs.deno.com/runtime/getting_started/installation), then
install dependencies:

```
deno install
```

Copy `.env.example` to `.env` and fill in the values (see below).

Then apply the database schema locally and seed it with sample data — the app
expects this to exist, so do it before starting `dev`:

```
deno task db:migrate:local
deno task db:seed
```

`db:migrate:local` finds (or creates) the local D1 SQLite file that Wrangler's
emulation uses and applies the migrations in `db/migrations/`. `db:seed`
populates it with sample data (work experience, education, projects, gallery
photos, releases) and copies the accompanying files into the local R2 bucket. In
production, migrations are applied automatically against the remote D1 database
as part of the deploy workflow (see below), not run by hand.

Now start the dev server:

```
deno task dev
```

This starts Vite/Fresh in dev mode with Wrangler's local emulation of the D1 and
R2 bindings, so no Cloudflare account is needed for local development.

The schema itself lives in `db/schema.ts` and is managed with Drizzle ORM/Kit;
after changing it, generate a new migration with `deno task db:generate` and
apply it locally as above. `deno task db:studio:local` opens Drizzle Studio
against the local database, useful for inspecting or editing rows by hand during
development.

Other tasks, defined in `deno.json`:

- `deno task check` — format check, lint, and type check; this is what CI runs
  before deploying
- `deno task build` — production build into `_fresh/`
- `deno task start` — serve the production build locally via plain Deno
  (bypasses Wrangler, so the D1/R2 bindings aren't available)
- `deno task update` — update the Fresh framework to its latest version

## Configuration

Environment variables are documented in `.env.example`. In production they're a
mix of Cloudflare secrets (`ADMIN_PASSWORD`, `JWT_SECRET`, `RESEND_API_KEY`) and
plain `[vars]` in `wrangler.toml` (`CONTACT_TO_EMAIL`, `JWT_EXPIRY_HOURS`,
`PHOTO_BASE_URL`).

## Project structure

- `routes/` — Fresh file-based routes; the public site (`/`, `/contact`,
  `/media/*`), the admin area (`/login`, `/admin`), and JSON/form-submission
  endpoints under `routes/api/`
- `islands/` — interactive Preact components hydrated on the client (photo
  gallery, audio player, admin forms, carousels)
- `components/` — server-rendered building blocks, including shadcn-derived UI
  primitives under `components/ui/`
- `lib/` — domain logic (auth, gallery, media, projects, work experience,
  education, releases/tracks) shared between routes and islands
- `db/` — Drizzle schema, migrations, seed script, and local/remote D1 client
  setup

Admin dashboard tabs each map to one of these domains — media library, gallery,
music (releases/tracks), education, work experience, and projects — with shared
create/update/delete handlers in `lib/`.

## Deployment

The app runs on Cloudflare Workers, using the `DB` (D1) and `CDN` (R2) bindings
declared in `wrangler.toml`. GitHub Actions (`.github/workflows/deploy.yml`)
runs `deno task check` and a build on every push and pull request; on push to
`main`, it also applies any pending D1 migrations against the remote database
and deploys via Wrangler.

One-time setup, before the first deploy:

- `wrangler secret put ADMIN_PASSWORD`, `wrangler secret put JWT_SECRET`,
  `wrangler secret put RESEND_API_KEY` — secrets live only in Cloudflare, not in
  this repo or CI.
- Add `CLOUDFLARE_API_TOKEN` (Workers Edit + D1 Edit permissions) and
  `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions repository secrets.

## License

This project is licensed under [GNU General Public License version 3](LICENSE)
license.
