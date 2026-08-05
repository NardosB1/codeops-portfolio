# Habesha Eatery Landing Page

## Requirements Checklist
- [x] **Box-sizing Reset & Base Typography:** Applied global border-box rule and readable system font stacks.
- [x] **Page Grid Skeleton:** Built `.page` container utilizing `display: grid` with `grid-template-rows: auto 1fr auto` to dynamically stretch the body between header and footer.
- [x] **Sticky Flexbox Navbar:** Pinned navigation header to the viewport using `position: sticky; top: 0;` alongside `display: flex` and `justify-content: space-between`.
- [x] **Auto-fit Menu Grid:** Configured the menu container using `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))` for intelligent layout reflowing.
- [x] **Flexbox Cards & Pinned Prices:** Structured individual cards as vertical flex containers (`display: flex; flex-direction: column;`) and applied `margin-top: auto` to force price alignment at the base.
- [x] **Absolute Badge Positioning:** Secured the "Popular" badge to the card corner utilizing `position: relative` on the parent card and `position: absolute` on the badge element.

## Self-Check / Testing Instructions
1. Open `index.html` in any browser.
2. Scroll down the page and verify that the navbar stays fixed at the top (sticky positioning).
3. Resize the window smoothly from maximum desktop width down to a narrow smartphone view; watch the card columns collapse naturally without breaking layouts.
4. Inspect card layouts to ensure elements of varying text length line up cleanly with prices locked uniformly to the bottom edge