Birr Watch — ETB Currency Converter & Watchlist
A vanilla JavaScript app that fetches live exchange rates for the Ethiopian Birr (ETB), converts amounts to a chosen currency, and lets users maintain a persistent watchlist of currencies.
Features
Live Data Integration — Fetches real-time ETB exchange rates from a public API on page load.
Currency Conversion — Convert any ETB amount to a selected currency using the live rates.
Watchlist Management — Add or remove currencies from a personal watchlist, with duplicates prevented.
State Persistence — Watchlist, last converted amount, and last selected currency are saved to `localStorage` and restored on reload.
Clean UI States — Status line reflects loading, success, and error states distinctly.
Files
`index.html` — Page structure: status line, conversion form, result display, watchlist.
`app.js` — All application logic (fetch, state, rendering, events, persistence).
How to Run
This app uses `fetch()` and `localStorage`, both of which behave unreliably when a file is opened directly (`file://...`) in some browsers. Run it through a local server instead:
Open the project folder in VS Code.
Install the Live Server extension.
Right-click `index.html` → Open with Live Server.
The app opens at an address like `http://127.0.0.1:5500/index.html`.
Data Source
Rates are fetched from:
```
https://open.er-api.com/v6/latest/ETB
```
No API key required. Response shape:
```json
{
  "result": "success",
  "base_code": "ETB",
  "rates": { "USD": 0.0177, "EUR": 0.0164, "...": "..." }
}
```
Each rate is "how much 1 ETB is worth" in that currency, so `amount * rates[code]` gives the converted value.
Architecture Notes
The app follows a state → render pattern:
`state` is a single object holding all data the app needs to remember (rates, watchlist, current amount/currency, status).
Event handlers and the fetch logic only ever update `state`.
A small set of `render*()` functions (`render`, `renderStatus`, `renderWatchlist`) read `state` and update the DOM to match.
This keeps the DOM and the underlying data in sync from a single source of truth, rather than scattering direct DOM writes throughout the code.
The watchlist's remove button uses event delegation: a single click listener on the `<ul>` checks `e.target` to determine which `<li>` was clicked, rather than attaching a listener to every individual button.
Known Limitations
No debounce/loading spinner beyond the text status line.
Watchlist rates are a live snapshot at fetch time; they don't auto-refresh without a page reload.