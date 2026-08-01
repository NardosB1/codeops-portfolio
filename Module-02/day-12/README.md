# Habesha Eatery Mini-Site

A two-page accessible web application built for a fictional restaurant in Bole, Addis Ababa, using semantic HTML5 and native web accessibility standards.

## Project Structure
- **`index.html`**: The reservation home page, featuring a table booking form, a structured ETB pricing menu, and an accessible image media block.
- **`contact.html`**: The contact page, featuring a user inquiry form and an operating hours schedule table.

---

## How to Open and Run the Site

### Method 1: Locally via Browser
1. Clone or download this repository to your local machine.
2. Open the project folder (`habesha-eatery`).
3. Double-click **`index.html`** to launch the site in your default web browser.
4. Use the navigation bar at the top of either page to seamlessly switch between the **Reservations** and **Contact** pages.

### Method 2: Live View via GitHub Pages
1. Go to your repository **Settings**.
2. Navigate to the **Pages** tab on the left sidebar.
3. Under **Build and deployment**, set the source branch to `main` (or `master`) and folder to `/ (root)`, then click **Save**.
4. Once active, GitHub will provide a live URL to view your deployed site.

---

## Implemented Accessibility Features

This project was built to comply with modern web accessibility guidelines (WCAG) and is fully optimized for assistive technologies and keyboard-only navigation:

1. **Semantic HTML Landmarks:** 
   - Utilizes distinct structural tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) on both pages, allowing screen reader users to instantly skip and jump to primary sections.
2. **Explicit Form Labeling:** 
   - Every form input (`<input>`, `<textarea>`, `<select>`) is explicitly tied to a `<label>` element using matching `for` and `id` attributes. Screen readers correctly announce field names on focus.
3. **Built-in Native Client Validation:** 
   - Uses native HTML attributes (`required`, `type="email"`, `pattern`) to prevent submission errors and validate formats (such as Ethiopian phone patterns) natively without forcing external scripts.
4. **Accessible Tables with Scope:** 
   - Data tables use `<caption>` elements to summarize their purpose. Column headers are explicitly marked up with `<th scope="col">` to bind data cells correctly for screen reader parsing.
5. **Alternative Text for Media:** 
   - Images incorporate descriptive `alt` text attributes, and embedded figures pair them natively with captions (`<figcaption>`) to provide full context to visually impaired users.
6. **Full Keyboard Operability:** 
   - The entire mini-site can be traversed, navigated, and operated by keyboard alone using standard `Tab`, `Shift + Tab`, and `Enter` keys, with natural focus rings maintained across all interactive elements.