# Ethiopian Signup Form with Real-time Validation & Persistence

A lightweight, zero-dependency client-side signup form that performs regex validation on Ethiopian phone numbers, provides real-time feedback, and persists entries in `localStorage`.

## Features
- **Validation**:
  - Name: Minimum 2 non-whitespace characters.
  - Ethiopian Phone: Supports local (`09...`, `07...`) and international (`+251...`, `251...`) formats via regex.
- **Real-Time Feedback**: Inline messages update dynamically on `input` and `blur` events.
- **First-Error Priority**: Highlights the first failing field if multiple errors exist during submit.
- **Persistence**: Automatically updates and restores JSON data using `localStorage`.

## Setup
1. Clone or download the repository files (`index.html`, `app.js`, `expected.txt`, `README.md`).
2. Open `index.html` in any web browser.