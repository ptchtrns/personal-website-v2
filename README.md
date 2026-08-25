> ⚠️ This is currently work in progress

# Personal Website v2

Personal website and media repository, built with
[Fresh](https://fresh.deno.dev) (Deno, Preact, Tailwind CSS v4), deployed to
[Cloudflare Workers](https://developers.cloudflare.com/workers/).

## Usage

Make sure to install Deno:
https://docs.deno.com/runtime/getting_started/installation

Install the dependencies:

```
deno install
```

Copy `.env.example` to `.env` and fill in the values, then start the project in
development mode:

```
deno task dev
```

Other tasks:

- `deno task check` – format check, lint and type check
- `deno task build` – build for production into `_fresh/`
- `deno task start` – serve the production build locally via Deno (does not
  use the D1/R2 bindings — see Deployment below)

## Configuration

| Variable           | Description                                          |
| ------------------ | ----------------------------------------------------- |
| `ADMIN_PASSWORD`   | Password for `/login`; login is disabled when unset  |
| `JWT_SECRET`       | Secret used to sign the session token                |
| `JWT_EXPIRY_HOURS` | Session lifetime in hours (default `24`)             |
| `PHOTO_BASE_URL`   | Public base URL gallery images are served from       |
| `RESEND_API_KEY`   | API key used to send contact-form emails             |
| `CONTACT_TO_EMAIL` | Inbox contact-form submissions are sent to           |

Media (photos, audio, PDFs) is stored in the `CDN` R2 bucket declared in
`wrangler.toml` — Wrangler's local R2 emulation in dev, the real binding once
deployed.

## Deployment

The app runs on Cloudflare Workers, using the `DB` (D1) and `CDN` (R2)
bindings declared in `wrangler.toml`. Pushing to `main` builds and deploys it
via GitHub Actions (`.github/workflows/deploy.yml`), applying any pending D1
migrations against the remote database first.

One-time setup, before the first deploy:

- `wrangler secret put ADMIN_PASSWORD`, `wrangler secret put JWT_SECRET`,
  `wrangler secret put RESEND_API_KEY` — secrets live only in Cloudflare, not
  in this repo or CI.
- Add `CLOUDFLARE_API_TOKEN` (Workers Edit + D1 Edit permissions) and
  `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions repository secrets.

## Routes

| Path          | Description                                       |
| ------------- | ------------------------------------------------- |
| `/`           | About me                                          |
| `/services`   | Services (in progress)                            |
| `/contact`    | Contact (in progress)                             |
| `/media`      | Photos and audio                                  |
| `/login`      | Admin login                                       |
| `/admin`      | Media upload, requires a session                  |
| `/api/me`     | `GET` – current session state                     |
| `/api/login`  | `POST` – exchange the admin password for a cookie |
| `/api/photos` | `GET` – list photos, `POST` – presign an upload   |

## License

This project is licensed under [GNU General Public License version 3](LICENSE)
license.
