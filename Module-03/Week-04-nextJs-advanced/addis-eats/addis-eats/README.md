# Addis Eats

Next.js App Router + TypeScript + Tailwind + Neon PostgreSQL capstone. This scaffold implements account creation/sign-in, signed HttpOnly sessions, a proxy cookie/signature gate, page-level checks, ownership-scoped order queries, protected order actions, staff role checks, `/api/me`, server-rendered menu queries, and baseline SEO routes.

## Requirements
- Node.js 20.9+ (Node 22 LTS recommended)
- A Neon PostgreSQL database
- npm

## Setup
1. Install Node.js, then run `npm install` in this folder.
2. Copy `.env.example` to `.env.local`.
3. In Neon, create a project/database. Copy its pooled or direct connection string to `DATABASE_URL`.
4. Generate a secret using `openssl rand -base64 32` and set `SESSION_SECRET` in `.env.local`.
5. Run the SQL in `db/schema.sql` using Neon SQL Editor.
6. Run `npm run typecheck`, `npm run test:security`, then `npm run dev`.
7. Open http://localhost:3000.

## Seed sample menu data
Run in Neon SQL Editor:
```sql
INSERT INTO dishes (slug,name,description,price_cents) VALUES
('doro-wat','Doro Wat','Spiced chicken stew served with injera.',18500),
('shiro','Shiro','Comforting chickpea stew.',9500),
('misir-wat','Misir Wat','Red lentil stew with berbere.',8500)
ON CONFLICT (slug) DO NOTHING;
```

## Verify
```bash
npm run typecheck
npm run test:security
npm run build
```
The build requires valid environment variables. The database must be reachable when rendering data-backed routes/building sitemap; configure Neon first.

## Security model
- `proxy.ts`: rejects private-route requests without a correctly signed, unexpired session token. It is only an early gate.
- Pages call `requireUser()` or `requireStaff()` and re-read the current user from the database.
- Server Actions and Route Handlers verify sessions again.
- `getOrdersFor(userId)` and `getOrderFor(userId, orderId)` always scope by the session-derived user ID.
- `cancelOrder` scopes its UPDATE by both order ID and session user ID.
- `updateOrderStatus` re-checks staff role in the action.
- `safeNext` rejects absolute and protocol-relative redirect targets.
- Cookie: `addis_eats_session`, HttpOnly, SameSite=Lax, Path=/, 7-day Max-Age, Secure in production (or COOKIE_SECURE=true).

## Scope / production checklist
This is a strong capstone foundation, not a claim that the entire commerce experience is finished. Before real customer use, add rate limiting for authentication, email verification and password reset, CSRF/origin policy review, audit logging, robust transaction strategy for inventory/order writes, payment provider integration, cart UI, status-poll UI, and operational monitoring. Neon serverless HTTP queries do not support interactive transactions; order creation is represented as one SQL statement/CTE. Test it against your actual Neon schema before deploying.

## Deployment
Deploy to a Node-compatible Next.js host (for example Vercel), set `DATABASE_URL`, `SESSION_SECRET`, `COOKIE_SECURE=true`, and `NEXT_PUBLIC_APP_URL` in the production environment, then redeploy. Use the deployed HTTPS URL to verify cookie flags and run Lighthouse on `/menu`. Do not fill measured values in PERF.md until you have actual deployed measurements.
