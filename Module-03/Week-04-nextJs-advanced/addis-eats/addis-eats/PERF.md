# PERF.md — Addis Eats

> A budget with only the final number proves nothing. The improvement is the evidence, not the score. Never invent measurements.

## 1. Performance budget

| Measure | Target | Before | After | What caused the change |
|---|---|---|---|---|
| LCP, throttled | Under 2.5 s | TODO | TODO | Measure deployed `/menu` |
| CLS | Under 0.1 | TODO | TODO | Measure deployed `/menu` |
| First Load JS, `/menu` | Under 120 kB | TODO | TODO | `next build` route table |
| Largest image | Under 150 kB | TODO | TODO | No dish images currently rendered |
| Lighthouse performance | 90 or better | TODO | TODO | Measure deployed `/menu` |

## 2. How to measure (same conditions before/after)

- URL: deployed production URL, `/menu`
- Tool: Lighthouse in Chrome DevTools, Mobile, Navigation mode, Incognito, extensions off
- Runs: 3 per measurement; record median
- First Load JS: read from `next build` route table
- Largest image: DevTools → Network → Img, sorted by transferred size
- Date / commit hash of baseline: TODO

## 3. Optimisation log

| # | Change | Files touched | Expected effect | Measured effect |
|---|---|---|---|---|
| 1 | Public menu rendered server-side | `src/app/menu/page.tsx`, `src/lib/queries.ts` | SEO and less client JS | TODO: measure |
| 2 | Metadata and sitemap generated from public dishes | `src/app/menu/[slug]/page.tsx`, `src/app/sitemap.ts` | Discoverability | TODO: verify deployed |
| 3 | No client bundle for menu list | `src/app/menu/page.tsx` | First Load JS | TODO: record route table |

## 4. Targets missed, and why

Fill this section only after measuring. A documented miss is better than a fabricated Lighthouse score.
