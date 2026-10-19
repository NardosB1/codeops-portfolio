# AUTH.md — Addis Eats

> Evidence must be recorded after testing. Do not claim a test passed until it has been run against the deployed build.

## 1. Decision one — who may see what

| Route | Who | Protected by | What that proves |
|---|---|---|---|
| `/menu`, `/menu/[slug]` | Everyone | Nothing | Public and indexable |
| `/signin`, `/signup` | Everyone | Nothing; signed-in users are redirected by page | Public entry point; `next` is validated |
| `/account` | Owner | `proxy.ts` + page check | Session is verified and user exists |
| `/orders` | Owner | proxy + page + scoped query | Signed in, only own records |
| `/orders/[id]` | Owner | proxy + page + scoped query | Order belongs to user, otherwise 404 |
| `/checkout` | Signed-in user | proxy + page | Signed in; write action validates all inputs |
| `/kitchen` | Staff only | proxy + page + role check in every action | Signed in and permitted |

## 2. Layer-by-layer proof

```text
/orders        proxy -> valid signed token, not merely cookie presence
               page  -> getSession verifies signature/expiry and user exists
               query -> getOrdersFor(session.userId)
               action -> cancelOrder checks session and UPDATE ownership
/orders/[id]   proxy -> valid signed token
               page  -> session verified
               query -> getOrderFor(session.userId, id); notFound() if no row
               action -> ownership re-checked
/checkout      proxy -> valid signed token
               page  -> session verified
               action -> placeOrder: session + Zod + server-recomputed prices
/kitchen       proxy -> valid signed token
               page  -> session verified + role === staff
               action -> updateOrderStatus re-checks session + role
```

## 3. Actions inventory

| Action | File | Session check | Input validation | Ownership / role check | Refusal |
|---|---|---|---|---|---|
| `signUp` | `src/actions/auth.ts` | Creates session only after insert | `signUpSchema` | Unique email/phone DB constraints | Returns generic validation/duplicate error |
| `signIn` | `src/actions/auth.ts` | Verifies credentials then creates session | `signInSchema` + `safeNext` | N/A | Generic invalid credentials |
| `signOut` | `src/actions/auth.ts` | Clears cookie | N/A | N/A | Redirects to `/` after clearing |
| `placeOrder` | `src/actions/orders.ts` | `getSession()` | `placeOrderSchema` | Creates under session user; prices re-read server-side | Returns error if unsigned/invalid/unavailable |
| `cancelOrder` | `src/actions/orders.ts` | `getSession()` | UUID schema | `WHERE id = ... AND user_id = session.userId` | Returns error if no owned cancellable order |
| `updateOrderStatus` | `src/actions/orders.ts` | `getSession()` | UUID + status schemas | `session.user.role === staff` | Returns error if unauthorized/invalid |

## 4. Session cookie

| Attribute | Expected | Evidence to record after deploy |
|---|---|---|
| Name | `addis_eats_session` | DevTools Application → Cookies |
| HttpOnly | true | Cookie details |
| Secure | true in production | Cookie details on HTTPS deployment |
| SameSite | Lax | Cookie details |
| Path | `/` | Cookie details |
| Max-Age | 604800 seconds (7 days) | Cookie details |

## 5. Three attacks

| Attack | Expected secure result | Code path to inspect | Observed evidence |
|---|---|---|---|
| Signed out: invoke `cancelOrder("ord_812")` | Returns refusal; no mutation | `src/actions/orders.ts`, session check at start | TODO: run test |
| Account A cancels Account B's order ID | Refused; no mutation | `cancelOrder` UPDATE includes `user_id = session.userId` | TODO: run two-account test |
| `/signin?next=https://example.com` | Redirects to `/` | `safeNext` in `src/lib/validation.ts` | Covered by security smoke test; confirm browser flow |
| Change `/orders/[id]` to another user's ID | 404/no data | `getOrderFor` WHERE clause | TODO: run two-account test |

## 6. Notes and limitations

The proxy uses a signature/expiry check as a fast filter. The page and action layers perform database-backed session resolution. Session revocation is not immediate if a copied signed cookie remains valid; use a server-side session table/version or short TTL if immediate revocation is required. Rate limiting and an explicit cross-origin/CSRF review are still required before production commerce use.
