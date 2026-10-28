<!-- FUTURE.md -->
# FUTURE.md: what I cut or left, and why

| Item | Why it was cut |
|---|---|
| Real database | Course decision: in-memory store. Orders placed at runtime are lost on restart and differ between serverless instances. |
| Server-side cart (cookie or database) | The brief says the cart never leaves the browser. Cost: checkout cannot place an order with JavaScript disabled, because the cart is only in localStorage. |
| Idempotency key on placeOrder | The button disables while pending, but a double submit across tabs could create two orders. |
| Revoking a session on sign-out | The session is a signed token, so a copied token stays valid until it expires. A database session or a denylist would fix it. |
| Rate limiting on sign-in | bcrypt slows guessing but nothing stops repeated attempts. |
| Distinguishing 403 from 404 on foreign orders | Deliberate: another person's order id looks exactly like a missing one. |