# Addis Eats

Order Ethiopian food from Addis Ababa. Browse the menu, search and filter it, build a cart, sign in, place an order and watch it move through the kitchen. Built with Next.js (App Router), TypeScript and Tailwind CSS.

**Live URL:** _add after the Vercel deploy (see `DEPLOY.md`)_

## Run from a fresh clone

Requires Node.js 20.9 or newer.

```bash
git clone <repo-url> addis-eats
cd addis-eats
npm install
cp .env.example .env.local        # then set SESSION_SECRET (below)
npm run build && npm run start    # http://localhost:3000
```

For development with hot reload use `npm run dev`. Judge performance and the ○ ● ƒ markers only on the production build.

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Environment variables

| Name | Required | Purpose |
|---|---|---|
| `SESSION_SECRET` | yes | Signs the session cookie. At least 32 characters. Never commit it. Without it, every page that checks the session fails loudly. |
| `NEXT_PUBLIC_SITE_URL` | no | Public origin for canonical links, Open Graph and the sitemap. On Vercel, the production URL is picked up automatically. Set it only for a custom domain. |

## Demo accounts

Password for all three: `addis2026`

| Phone | Name | Role |
|---|---|---|
| 0911000001 | Almaz | customer |
| 0911000002 | Dawit | customer |
| 0911000003 | Selam | staff (can open `/kitchen`) |

## Endpoints

| Method and path | Auth | Success | Failures |
|---|---|---|---|
| GET `/api/dishes?category=&q=` | none | 200 `{ dishes }` | |
| GET `/api/dishes/[id]` | none | 200 `{ dish }` | 404 `{ error }` |
| POST `/api/orders` | session cookie | 201 `{ order }` | 401, 415, 400, 422 `{ error, fieldErrors }` |
| GET `/api/orders/[id]/status` | session cookie, owner only | 200 `{ status }` | 401, 404 |
| GET `/api/session` | none | 200 `{ user: { name, role } \| null }` | |

## Documents

| File | What it answers |
|---|---|
| `STRATEGY.md` | Why each route is static, ISR or dynamic |
| `BOUNDARY.md` | Which components run on the server or the client, and why |
| `AUTH.md` | Who may see what, the three security layers, the actions inventory, the attacks |
| `DATA.md` | Where each piece of data is fetched and how it refreshes |
| `PERF.md` | The performance budget, method, and measured results |
| `PENTEST.md` | Step-by-step attack procedures that feed `AUTH.md` |
| `DEPLOY.md` | Deploying to Vercel and verifying the live site |
| `FUTURE.md` | What was cut or left, and why |

## Known limitation (read before deploying)

Orders live in an in-memory store (a course decision). On Vercel each server instance has its own copy, so an order you place at runtime may not be visible to another instance. The three seeded orders always exist. See `FUTURE.md` for the fix (replace `lib/orders.ts` with a database).

## Build output

_Paste the `npm run build` route table here after your first production build._
