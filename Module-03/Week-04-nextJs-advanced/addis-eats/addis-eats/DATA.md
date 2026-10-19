# DATA.md — Addis Eats

## 1. Decision two — where data is fetched

| Data | Where | Why |
|---|---|---|
| Menu and dishes | Server | Public, indexable, cacheable |
| Order history | Server | Private, scoped to session |
| Order status | Server endpoint; SWR-ready client contract | Refreshes without user action; endpoint checks session and ownership |
| Menu search | Planned client/SWR enhancement | Typing-triggered, debounce before request |
| Cart | Client store (not included yet) | Only sent to server when placing order |

## 2. Every query

| Query | Server / Client | Key | Refresh rule | Seeded by | Reasoning |
|---|---|---|---|---|---|
| `getMenu()` | Server | n/a | `revalidate = 300` on menu route | SQL seed in README | Shared public data, rendered for crawlers |
| `getDish(slug)` | Server | n/a | Same route revalidation policy | SQL seed | Public detail page; metadata and sitemap |
| `getOrdersFor(session.userId)` | Server | n/a | Dynamic, never shared across users | User-created orders | WHERE uses session ID, not browser input |
| `getOrderFor(session.userId, orderId)` | Server | n/a | Dynamic | User-created orders | Same scoping; missing row becomes 404 |
| `/api/orders/[id]/status` | Client polling contract | URL | Suggested ~5 seconds; stop for terminal status in client | Server detail page can seed | Status updates; endpoint rechecks session + ownership |
| Menu search | Not implemented yet | Proposed `/api/menu/search?q=` | Proposed 300ms debounce | Full server-rendered menu | Triggered by typing, not render |
| Cart | Not implemented yet | local state/store | n/a | Browser interaction | Client state only until `placeOrder` |

## 3. Verification

| Check | How | Expected | Observed |
|---|---|---|---|
| Menu rendering | Load `/menu` with seeded data | HTML contains dish names | TODO: verify deployed URL |
| Seeding | Hard reload private order page | Initial data rendered server-side | TODO: verify with real order |
| Poll endpoint scope | Request another user's order status | 404/refused | Query is scoped; TODO: run two-account test |
| Menu search debounce | Not implemented | N/A | Deferred |
