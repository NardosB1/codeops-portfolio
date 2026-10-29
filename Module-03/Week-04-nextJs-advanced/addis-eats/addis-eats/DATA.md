# DATA.md — Addis Eats

> Rule of thumb: **server unless the person triggers it.** Where a client query is unavoidable, the server renders the first result and passes it in as `fallbackData`, so nobody watches a spinner for data we already had.

## 1. Decision two — where data is fetched

| Data | Where | Why |
|---|---|---|
| Menu and dishes | Server | Public, indexable, cacheable |
| Order history | Server | Private, scoped to the session |
| Order status | Server first, then polled on the client | Must keep refreshing on its own |
| Menu search | Client | Triggered by typing, debounced |
| Cart | Client store | It never leaves the browser until `placeOrder` |

## 2. Every query

| Query | Server / Client | Key | Refresh rule | Seeded by | One line of reasoning |
|---|---|---|---|---|---|
| `getDishes()` (menu) | Server | n/a (ISR, 1 hour) | `revalidate = 3600` on `/menu` | n/a | Same for everyone, so it can be rendered to HTML once for crawlers |
| `getDish(id)` | Server | n/a (static via `generateStaticParams`, 1 hour) | `revalidate = 3600` | n/a | Public detail page; also feeds `generateMetadata` and the sitemap |
| `getOrdersFor(session.id)` | Server | n/a | Dynamic, never shared across users | n/a | Private; the filter uses the session id, never an id sent by the browser (`lib/orders.ts`) |
| `getOrderFor(session.id, orderId)` | Server | n/a | Dynamic | n/a | Same scoping; no row means `notFound()` |
| Order status poll | Client (SWR) | `/api/orders/[id]/status` | `refreshInterval` 5000 ms; returns 0 (stops) once the status is `delivered` or `cancelled` | `fallbackData` from `getOrderFor` on the server (`app/orders/[id]/page.tsx`) | Status changes without the person doing anything; the endpoint re-checks session + ownership |
| Menu search | Client (SWR) | `/api/dishes?q=<term>` | Debounce 300 ms; key is `null` (no request) for fewer than 2 characters | `fallbackData` = the full menu ids, rendered by the server (`app/menu/layout.tsx`) | Triggered by typing, so it cannot run at render time |
| Cart | Client store | n/a (localStorage via `useSyncExternalStore`) | n/a | n/a | Not data the server needs until `placeOrder` |
| Session (header) | Client (SWR) | `/api/session` | Re-checked on every navigation | none (shows a placeholder, no layout shift) | The header must not read cookies on the server, or every route would become dynamic |

## 3. Verification (fill in on the deployed URL)

| Check | How | Expected | Observed |
|---|---|---|---|
| Debounce | Network tab, type "lentil" quickly | One request per pause, not per keystroke; none for 1 character | **YOU** |
| Seeding | Hard-reload `/orders/ord_813` as Almaz | Status on arrival, no spinner | **YOU** |
| Poll stops | Cancel the order, watch Network | Requests stop once status is `cancelled` | **YOU** |
| Poll is scoped | Request `/api/orders/ord_812/status` as Almaz | 404 | **YOU** |
| Category filter | Click "Drinks" | No network request; non-drinks hidden | **YOU** |

The data layer (`lib/dishes.ts`, `lib/orders.ts`) is async and is the only code that touches the data, so a real database replaces those two files and nothing else.
