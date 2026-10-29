# PERF.md — Addis Eats

> A budget with only the final number proves nothing. The improvement is the evidence, not the score.
> The **Before** column is measured *after all features are complete and before any optimisation you choose to make*. Measure on the **deployed production build**, never `next dev`.
> Every number below is **YOU**: this file ships with the targets and the method, not with invented results.

## 1. Decision three — the performance budget

| Measure | Target | Before | After | What caused the change |
|---|---|---|---|---|
| LCP, throttled | Under 2.5 s | | | |
| CLS | Under 0.1 | | | |
| First Load JS, `/menu` | Under 120 kB | | | |
| Largest image | Under 150 kB | n/a (the app ships no raster images) | | |
| Lighthouse performance | 90 or better | | | |

## 2. How to measure (keep identical for Before and After)

- URL: deployed production URL, `/menu`
- Tool: Lighthouse in Chrome DevTools, **Mobile**, **Navigation** mode, Incognito window with extensions off
- Runs: 3 per measurement; record the median
- First Load JS: read from the `next build` route table
- Largest image: DevTools → Network → Img, sorted by size (transferred)
- Date / commit hash of the baseline: **YOU**

## 3. Already built in (so measure these, do not claim them as new work)

| Choice | Where | Expected effect |
|---|---|---|
| Static / ISR rendering for public pages | `app/page.tsx`, `app/menu/**` (`STRATEGY.md`) | Fast TTFB, HTML ready for crawlers |
| Fonts self-hosted by `next/font` | `app/layout.tsx` | No render-blocking font request, no font layout shift |
| Client JavaScript only in leaves | `BOUNDARY.md` (8 components) | Small First Load JS |
| Category filter by CSS, not by re-fetching | `app/menu/MenuShell.tsx` | No network cost to filter |
| Search results CDN-cacheable | `app/api/dishes/route.ts` (`Cache-Control: s-maxage=60`) | Repeated searches are cheap |
| Skeleton for the menu | `app/menu/loading.tsx` | Header shows at once; no blank page |

## 4. Optimisation log (your measured pass)

Make at least one change, measure it, and record it. Ideas that fit this app:

| # | Change | Files touched | Expected effect | Measured effect |
|---|---|---|---|---|
| 1 | Add real dish photos with `next/image` (`width`/`height`, `sizes`, `priority` on the first row) | `components/DishCard.tsx`, `public/` | LCP, CLS, largest image | **YOU** |
| 2 | Load `OrderStatusLive` only where needed (`next/dynamic`) | `app/orders/[id]/page.tsx` | First Load JS | **YOU** |
| 3 | Re-check `/menu` First Load JS after removing any unused dependency | `package.json` | First Load JS | **YOU** |

## 5. Targets I missed, and why

_If a number would not come down, write why. A documented failure you understand is worth more than a number you cannot explain._
