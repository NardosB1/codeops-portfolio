# Addis Market — Shopping List

A single-page shopping list app built with plain HTML, CSS, and JavaScript —
no frameworks, no build step. Add items with a name and an ETB price, mark
them as bought, remove them, and watch a running total update live.

## How to open it

1. Make sure `index.html`, `styles.css`, and `app.js` are in the same folder.
2. Double-click `index.html` (or right-click → Open With → your browser).

That's it — no server, no npm install, no build tools required.

## What it does

- **Add an item** — fill in the item name and its price in ETB, then submit
  the form. The page does not reload (`preventDefault` on submit), and both
  fields are validated before an item is added (name can't be empty, price
  must be a positive number).
- **Mark as bought** — click anywhere on a row to toggle its "bought" state.
  This adds/removes a `.bought` class; all the visual styling (strikethrough,
  color change, checkmark) lives in `styles.css`, not in inline styles.
- **Delete an item** — click the small `×` button on a row to remove it.
- **Live total** — the total at the bottom recalculates automatically
  whenever an item is added or removed.

## How it's built

- **State lives in the DOM.** Each list row (`<li>`) stores its own price in
  a `data-price` attribute. `updateTotal()` simply reads every row in the
  list and sums that attribute — there's no separate JavaScript array to
  keep in sync, so the DOM can't drift out of sync with "the data."
- **Rows are built with `createElement`/`append`**, not by rebuilding the
  list from an HTML string. Each new item is one new `<li>` appended to the
  existing list.
- **One delegated click listener** is attached to the `<ul id="list">`
  container, not to individual rows. It uses `event.target.closest(...)` to
  figure out whether the click landed on the delete button or on the row
  itself, so deleting and toggling both work no matter which child element
  (name text, price text) was actually clicked.
- **Element references are cached once** at the top of `app.js`
  (`form`, `nameInput`, `priceInput`, `list`, `totalEl`, `emptyState`)
  instead of being re-queried on every interaction.

## Design notes

The visual style leans into the "market" concept: a paper-ledger/receipt
look, with item prices set in a monospace font (like a printed receipt),
a dashed "tear line" above the total, and a coffee-and-spice-market color
palette (deep coffee ink, mustard/turmeric accent, muted teal for "bought,"
berbere-red for delete).

## Checklist self-check

- [x] Form adds an item without reloading the page
- [x] Exactly one delete listener, on the parent `<ul>`, not per row
- [x] Clicking a row toggles a `.bought` class; styling lives in CSS
- [x] ETB total updates correctly on add and on delete
- [x] DOM element references are queried once and cached
