TeleBirr Transaction Report
A tiny report generator over a list of TeleBirr transactions for an Addis shop. Built to practice `map`/`filter`/`reduce`, destructuring, spread, and ES module syntax.
Modules:
`transactions.js` — Owns the data. Exports a single array,`transactions`, of objects shaped `{ id, customer, amount, type }`
(`type` is `"credit"` or `"debit"`, `amount` is in ETB). No logic lives here, just the raw records.
`report.js` — Owns the logic. Pure functions that take transactions in and return new values out; nothing here mutates its input or prints anything.
`totalByType(txns, type)` — `filter` + `reduce` to sum all amounts of one type.
`byType(txns, type)` — `filter` to get just the transactions of one type.
`formatReceipts(txns)` — `map` with `{ id, customer, amount, type }` destructuring in the callback to build one formatted receipt line per transaction.
`correctAmount(txn, newAmount)` — uses object spread (`{ ...txn, amount: newAmount }`) to return a corrected copy of a transaction without touching the original object.
`buildSummary(txns)` — combines the two totals into `{ totalCredits, totalDebits, net }`.
`app.js` — Owns the wiring and output. Imports the data from
`transactions.js` and the functions from `report.js`, then prints the receipts, the totals, and a demo of the spread-based correction. This is the only file that calls `console.log`.
Running it
```bash
node app.js
```
(`package.json` sets `"type": "module"` so the `import`/`export` syntax
works directly in Node.)
Sample output
```
=== TeleBirr Transaction Report ===

Receipts:
#1 Almaz: -250 ETB (debit)
#2 Dawit: +600 ETB (credit)
#3 Tigist: -180 ETB (debit)
#4 Bekele: +1200 ETB (credit)
#5 Selam: -75 ETB (debit)
#6 Mekdes: +430 ETB (credit)

Totals:
Credits: 2230 ETB
Debits: 505 ETB
Net balance: 1725 ETB
