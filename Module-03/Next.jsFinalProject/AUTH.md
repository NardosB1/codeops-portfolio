# AUTH.md — Addis Eats

> Layer 1 = `proxy.ts` (called `middleware.ts` before Next.js 16). Layer 2 = page check (`lib/dal.ts`). Layer 3 = check inside every Server Action / Route Handler.
> File:line references are for the code as submitted; re-check them if you edit the files.
> Cells marked **YOU** are evidence only you can produce (screenshots, observed results). Fill them from `PENTEST.md` and `DEPLOY.md`.

## 1. Decision one — who may see what

| Route | Who | Protected by | What that proves |
|---|---|---|---|
| `/`, `/menu`, `/menu/[id]`, `/cart` | Everyone | Nothing | Public, and indexable (except `/cart`, which is `noindex`) |
| `/signin` | Everyone (signed-in users are sent on) | Nothing | Public entry point; the `next` param is validated by `safeNext` |
| `/orders` | The owner | proxy + page + scoped query | Signed in, and only their own records |
| `/orders/[id]` | The owner | proxy + page + scoped query | Signed in, and this order belongs to them (else 404) |
| `/checkout` | Any signed-in user | proxy + page | Signed in. The write (action) checks the rest |
| `/kitchen` | Staff only | proxy + page + role check in every action | Signed in, and permitted |
| `/api/orders` (POST) | Signed-in user | handler | 401 without a valid session |
| `/api/orders/[id]/status` | The owner | handler | 401 without a session, 404 for someone else's order |

**Design note:** the course lists `/kitchen` as "page + role check in every action". The brief also says *three layers on every private route*, so `/kitchen` is in the proxy matcher too. It costs one line and gives every private route the same three layers.
`/api/*` is deliberately not in the proxy matcher: an API client needs a JSON 401 from the handler, not a redirect to an HTML sign-in page.

## 2. Layer-by-layer proof (one line per layer)

```
/orders        proxy   -> cookie exists and has 3 parts            proxy.ts:12
               page    -> session verified (signature, expiry, user exists)   lib/dal.ts:9
               query   -> getOrdersFor(session.id)                  lib/orders.ts (filter by userId)
               action  -> cancelOrder re-checks session + ownership actions.ts:95, lib/orders.ts:107

/orders/[id]   proxy   -> cookie exists
               page    -> session verified                          lib/dal.ts:9
               query   -> getOrderFor(session.id, id)               lib/orders.ts:64  (notFound() if no row)
               poll    -> /api/orders/[id]/status re-checks session + ownership   app/api/orders/[id]/status/route.ts:12

/checkout      proxy   -> cookie exists
               page    -> session verified                          lib/dal.ts:9
               action  -> placeOrder: session verified (actions.ts:64) + Zod (actions.ts:81)
                          + owner from session + prices recomputed on the server (lib/orders.ts createOrder)

/kitchen       proxy   -> cookie exists
               page    -> session verified + role === "staff"       lib/dal.ts:16
               action  -> updateOrderStatus: session (actions.ts:112) + role (actions.ts:113)
                          + role re-checked in the data layer (lib/orders.ts:125)
```

## 3. Actions inventory

| Action | File | Session check | Input validation | Ownership / role check | Line that refuses |
|---|---|---|---|---|---|
| `signIn` | `app/actions.ts` | n/a (public) | `SignInSchema` (Zod) | n/a | `actions.ts:41` generic "Wrong phone number or password." |
| `signOut` | `app/actions.ts` | n/a (deleting a cookie is harmless) | n/a | n/a | n/a |
| `placeOrder` | `app/actions.ts` | `getSession()` then redirect (`:64`) | `PlaceOrderSchema` (`:81`) | owner set from the session; prices from `createOrder` | `actions.ts:64` and `:81` |
| `cancelOrder` | `app/actions.ts` | `getSession()` throws "Not signed in" (`:95`) | `OrderIdSchema` (`:97`) | `cancelOrderFor(user.id, id)` | `lib/orders.ts:107` (`o.id === orderId && o.userId === userId`) |
| `updateOrderStatus` | `app/actions.ts` | `getSession()` (`:112`) | `OrderIdSchema`, `OrderStatusSchema` | `user.role !== "staff"` (`:113`) and again at `lib/orders.ts:125` | `actions.ts:113` |

**Ownership design choice.** The course slide fetches the order and then compares owners (a `403 "Not yours"`). Here the owner is part of the lookup, so another person's order is simply "No such order". That is the same answer as a missing order, so ids cannot be probed to learn which exist. There is no unscoped lookup in the code to forget.

## 4. Session cookie (verify in DevTools → Application → Cookies)

| Attribute | Expected | Observed (deployed URL) | Evidence |
|---|---|---|---|
| Name | `session` | **YOU** | screenshot |
| HttpOnly | ✓ | **YOU** | screenshot |
| Secure | ✓ (production) | **YOU** | screenshot |
| SameSite | Lax | **YOU** | screenshot |
| Path | `/` | **YOU** | |
| Expires / Max-Age | 7 days (604800 s) | **YOU** | |

Set in `lib/session.ts` (`createSession`). The value is a signed JWT (HS256, algorithm pinned on verify) holding only the user id; name and role are looked up on every request.
**Known trade-off:** a signed token cannot be revoked before it expires. After sign-out a copied token still works until day 7. See `FUTURE.md` (database sessions or a denylist).

## 5. The three attacks (all must fail)

Procedure for every row is in `PENTEST.md`. "Baseline" means the same attack against a temporary copy with the named check removed.

| # | Attack | Baseline (unprotected) | Secure result | Line that refused it | Evidence |
|---|---|---|---|---|---|
| 1 | Signed out: replay the cancel action with no session cookie | **YOU** (PENTEST §1, baseline) | refused (action throws; nothing changes) | `actions.ts:95` | **YOU** |
| 2 | Signed in as Dawit: cancel Almaz's `ord_813` | **YOU** (PENTEST §2, baseline) | refused **on ownership**, not on session; `ord_813` unchanged | `lib/orders.ts:107` | **YOU** |
| 3 | Crafted link: `/signin?next=https://example.com` (and `//example.com`) | **YOU** (PENTEST §3, baseline) | lands on `/`, not on example.com | `lib/safe-next.ts:7` and `:12` | **YOU** |
| + | Change the id in `/orders/[id]` to another account's | **YOU** | 404 page, no data | `lib/orders.ts:64` | **YOU** |
| + | Poll `/api/orders/<other id>/status` | **YOU** | 404 JSON | `app/api/orders/[id]/status/route.ts:15` | **YOU** |

Optional bonus rows: CSRF on a Server Action from another origin (Next compares `Origin` to `Host` and rejects mismatches, plus `SameSite=Lax`); reusing a stolen session cookie after sign-out (it still works: see the trade-off above).
