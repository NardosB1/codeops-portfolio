# BOUNDARY.md — server or client, per component

| File | Side | Why |
|---|---|---|
| `app/layout.tsx` | server | Passes children into Providers; no state |
| `components/Providers.tsx` | client | Cart state + localStorage (`useSyncExternalStore`) |
| `components/Header.tsx` | server | Links only; reads no cookies |
| `components/AuthNav.tsx` | client | Fetches `/api/session`, shows the cart count, hosts the sign-out button |
| `components/DishCard.tsx` | server | Markup only |
| `components/AddToCartButton.tsx` | client | `onClick` writes to the cart store |
| `components/OrderStatusLive.tsx` | client | SWR polling needs the browser |
| `app/menu/layout.tsx` | server | Awaits categories and dishes; passes the list down as `children` |
| `app/menu/MenuShell.tsx` | client | Selected-category and search state; debounced SWR; receives the server-rendered dishes as `children` |
| `app/menu/page.tsx`, `app/menu/[id]/page.tsx` | server | Await data |
| `app/cart/page.tsx` | server | Static shell and metadata |
| `app/cart/CartView.tsx` | client | Reads the cart store |
| `app/checkout/page.tsx` | server | Session check (layer 2) |
| `app/checkout/CheckoutForm.tsx` | client | `useActionState` pending/error state; reads the cart |
| `app/signin/page.tsx` | server | Reads `searchParams` and the session |
| `app/signin/SignInForm.tsx` | client | `useActionState` pending/error state |
| `app/orders/**`, `app/kitchen/page.tsx` | server | Per-user data; the buttons are forms posting to Server Actions, so they need no client JavaScript |
| `app/error.tsx`, `app/menu/error.tsx`, `app/global-error.tsx` | client | Next requires error boundaries to be client components |

**Client components: 8** (Providers, AuthNav, AddToCartButton, OrderStatusLive, MenuShell, CartView, CheckoutForm, SignInForm), plus the 3 required error boundaries = **11 files containing `"use client"`**.
Week 8 needed five of these; week 9 added AuthNav and SignInForm; week 10 added OrderStatusLive.

**Composition rule:** `Providers` and `MenuShell` wrap server content, so they receive it as `children`. A client component cannot import a server component, but it can render one that was passed to it.

**Secrets rule:** everything that touches secrets or data carries `import "server-only"` (`lib/session.ts`, `lib/users.ts`, `lib/dal.ts`, `lib/dishes.ts`, `lib/orders.ts`). If a client component ever imports one by mistake, the build fails instead of leaking it.

## Verify
```bash
grep -rl "use client" app components      # expect exactly 11 files
grep -r "SESSION_SECRET" .next/static     # expect no output
grep -r "addis2026" .next/static          # expect no output
```
