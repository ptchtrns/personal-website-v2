> ⚠️ This is currently work in progress

# Personal Website v2

Personal website and media repository, built with
[Fresh](https://fresh.deno.dev) (Deno, Preact, Tailwind CSS v4).

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
- `deno task start` – serve the production build

## Configuration

| Variable                                     | Description                                         |
| -------------------------------------------- | --------------------------------------------------- |
| `ADMIN_PASSWORD`                             | Password for `/login`; login is disabled when unset |
| `JWT_SECRET`                                 | Secret used to sign the session token               |
| `JWT_EXPIRY_HOURS`                           | Session lifetime in hours (default `24`)            |
| `MONGO_URI`, `MONGO_DB`                      | MongoDB connection                                  |
| `PHOTOS_COLLECTION`                          | Collection holding photo metadata                   |
| `PHOTO_BASE_URL`                             | Public base URL the photo variants are served from  |
| `S3_BUCKET`, `AWS_REGION`                    | Bucket that receives the uploaded originals         |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | AWS credentials for presigning uploads              |

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
