# Addis Eats

Order Ethiopian food from Addis Ababa. Browse the menu, build a cart, sign in, place an order and watch it move through the kitchen. Built with Next.js (App Router), TypeScript and Tailwind.

**Live URL:** _add after the Vercel deploy (Step 7)_

## Run from a fresh clone
    git clone <repo-url> && cd addis-eats
    npm install
    cp .env.example .env.local      # then set SESSION_SECRET (see below)
    npm run build && npm run start  # http://localhost:3000

Generate a secret: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

## Environment variables
| Name | Purpose |
|---|---|
| `SESSION_SECRET` | Signs the session cookie. At least 32 characters. Never commit it. |

## Demo accounts (password `addis2026`)
| Phone | Name | Role |
|---|---|---|
| 0911000001 | Almaz | customer |
| 0911000002 | Dawit | customer |
| 0911000003 | Selam | staff |

## Endpoints
| Method and path | Auth | Success | Failures |
|---|---|---|---|
| GET `/api/dishes?category=&q=` | none | 200 `{ dishes }` | |
| GET `/api/dishes/[id]` | none | 200 `{ dish }` | 404 `{ error }` |
| POST `/api/orders` | session cookie | 201 `{ order }` | 401, 415, 400, 422 `{ error, fieldErrors }` |
| GET `/api/session` | none | 200 `{ user \| null }` | |

## Documents
STRATEGY.md · BOUNDARY.md · AUTH.md · DATA.md · PERF.md · FUTURE.md

## Build output
_Paste the `npm run build` route table here._