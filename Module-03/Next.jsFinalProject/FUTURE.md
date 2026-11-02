# FUTURE.md — what I cut or left, and why

| Item | Why it was cut | What it costs today |
|---|---|---|
| Real database | Course decision: in-memory seeded store | Orders placed at runtime are lost on restart, and **each Vercel instance has its own copy**. A new order may be missing from another instance (the status poll can answer 404). Seeded orders always exist. Fix: replace `lib/orders.ts` with Postgres or Redis; nothing else changes |
| Server-side cart | The brief keeps the cart in the browser | Checkout cannot place an order with JavaScript disabled, because the cart is only in localStorage |
| Idempotency key on `placeOrder` | Out of scope | The button disables while pending, but a double submit across two tabs could create two orders |
| Revoking a session on sign-out | Stateless signed token | A copied token stays valid until it expires (7 days). Fix: database sessions or a denylist |
| Rate limiting on sign-in | Out of scope | bcrypt slows guessing, but nothing stops repeated attempts. Fix: Upstash / Vercel KV counter per phone and IP |
| Content-Security-Policy | Needs per-request nonces, which makes every route dynamic and undoes `STRATEGY.md` | Other security headers are set in `next.config.ts` (nosniff, frame deny, referrer, HSTS, permissions) |
| 403 vs 404 on a foreign order | Deliberate | Another person's order id looks exactly like a missing one |
| Real dish photos | No assets in the repo | `PERF.md` row "Largest image" is n/a until photos exist |
| Real password storage / sign-up | Demo accounts only | The demo password is in the source and in the README |
| Automated tests | Out of scope | Verification is manual (`PENTEST.md`, `DEPLOY.md`) |
