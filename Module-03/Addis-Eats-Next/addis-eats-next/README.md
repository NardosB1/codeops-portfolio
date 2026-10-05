# Addis Eats

Addis Eats is a modern web application built for exploring authentic Ethiopian cuisine, managing orders, and seamless checkout. Built using **Next.js App Router** and **Tailwind CSS**.

---

## Features & Architecture

* **File-Based Routing:** Utilizes Next.js App Router structure under `app/`.
* **Nested Layouts & UI Shells:** Persistent sidebar navigation for the menu segments using `layout.js`[cite: 37, 50].
* **Rendering Strategies:** Optimized performance combining Static Site Generation (SSG), Incremental Static Regeneration (ISR), and Server-Side Rendering (SSR)[cite: 39, 40, 62].
* **Loading & Error Handling:** Segment-level fallbacks with `loading.js` and resilient error boundaries with `error.js`[cite: 4, 5, 28].
* **Not-Found Handling:** Graceful 404 handling using global and segment-level `not-found.js`[cite: 5, 29].

---

## Project Structure

```text
app/
├── layout.js                 # Root shell layout
├── page.js                   # Landing/Home page (SSG)
├── not-found.js              # Global 404 handler
├── menu/
│   ├── page.js               # Menu catalog (ISR)
│   ├── layout.js             # Menu layout with category sidebar
│   ├── loading.js            # Loading skeleton
│   ├── error.js              # Segment error boundary
│   └── [id]/
│       └── page.js           # Dynamic dish details page
├── cart/
│   └── page.js               # User cart (Client-side)
└── checkout/
    └── page.js               # Checkout flow (SSR / Dynamic)