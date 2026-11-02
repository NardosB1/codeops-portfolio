# STRATEGY.md — rendering strategy per route

Questions asked of every route: who is asking? how stale may it be? do I know the ids? does it read a cookie? is it private to one tab?

| Route | Strategy | Build marker | One line of reasoning |
|---|---|---|---|
| `/` | Static | ○ | Same page for everyone; specials change when I redeploy |
| `/menu` | ISR, `revalidate = 3600` | ○ (1h) | Dishes change a few times a day; nobody in particular is asking |
| `/menu/[id]` | Static via `generateStaticParams`, `revalidate = 3600` | ● (1h) | Ids are known at build. The hour keeps a price change on `/menu` from staying stale on the dish page |
| `/cart` | Static shell, content on the client | ○ | The cart is private to this browser (localStorage) |
| `/checkout` | Dynamic | ƒ | Reads the session cookie |
| `/signin` | Dynamic | ƒ | Reads `searchParams` and the session |
| `/orders`, `/orders/[id]`, `/kitchen` | Dynamic | ƒ | Per-person data from the session cookie |
| `/api/dishes`, `/api/dishes/[id]` | Dynamic | ƒ | Handlers that read the request URL |
| `/api/orders`, `/api/orders/[id]/status`, `/api/session` | Dynamic | ƒ | Read the cookie |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | Static | ○ | Generated once at build |
| `/menu/[id]/opengraph-image` | On demand | ƒ | One card per dish, generated when first asked for |

(Next 16 prints `ƒ` for dynamic routes; the course slides write λ. Same meaning.)

## Route I changed my mind about
`/menu/[id]` started as plain "static". Writing the justification showed it would keep an old price after `/menu` refreshed, so it got the same one-hour revalidate.

## Why the header reads no cookies
Reading a cookie in the root layout would make every route dynamic, including `/menu`. The header (a client component, `AuthNav`) asks `/api/session` from the browser instead.

## Why there is no `cacheComponents`
The course grades `export const revalidate` and the ○ ● ƒ markers. Cache Components replaces that model, so it stays off in `next.config.ts`.

## Verify
`npm run build`, then compare the printed route table with this file. Any disagreement is either a bug (something reads a cookie it should not) or a decision to revisit.
