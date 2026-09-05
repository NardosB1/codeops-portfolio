// Country Facts — app.js
// Fetches live data from restcountries.com and renders it with
// explicit loading, success, and error states. No framework: just
// fetch, async/await, and DOM APIs (createElement).

const API_BASE = "https://restcountries.com/v3.1/name/";
const DEFAULT_COUNTRY = "Ethiopia";

const out = document.querySelector("#facts");
const form = document.querySelector("#search-form");
const input = document.querySelector("#country-input");

/**
 * Clears #facts and shows a "Loading..." indicator.
 */
function renderLoading() {
  out.innerHTML = "";
  const loading = document.createElement("p");
  loading.className = "state state--loading";
  loading.textContent = "Loading…";
  out.appendChild(loading);
}

/**
 * Clears #facts and shows a friendly error message.
 * @param {string} message
 */
function renderError(message) {
  out.innerHTML = "";
  const error = document.createElement("p");
  error.className = "state state--error";
  error.textContent = message;
  out.appendChild(error);
}

/**
 * Builds one label/value block inside a parent element using createElement
 * (no innerHTML for the data itself, per the assignment requirement).
 * @param {HTMLElement} parent
 * @param {string} label
 * @param {string} value
 * @param {boolean} wide
 */
function renderFact(parent, label, value, wide = false) {
  const fact = document.createElement("div");
  fact.className = wide ? "fact fact--wide" : "fact";

  const dt = document.createElement("span");
  dt.className = "fact__label";
  dt.textContent = label;

  const dd = document.createElement("p");
  dd.className = "fact__value";
  dd.textContent = value;

  fact.appendChild(dt);
  fact.appendChild(dd);
  parent.appendChild(fact);
}

/**
 * Turns a restcountries currencies object into a readable string, e.g.
 * "Ethiopian birr (ETB, Br)".
 * @param {object} currencies
 */
function formatCurrencies(currencies) {
  if (!currencies) return "Not available";
  return Object.entries(currencies)
    .map(([code, c]) => `${c.name} (${code}${c.symbol ? `, ${c.symbol}` : ""})`)
    .join(", ");
}

/**
 * Renders a full country card into #facts using createElement.
 * @param {object} c - a single country object from the restcountries API
 */
function renderCountry(c) {
  out.innerHTML = "";

  const card = document.createElement("article");
  card.className = "card";

  // Header: flag + name
  const head = document.createElement("div");
  head.className = "card__head";

  const flag = document.createElement("img");
  flag.className = "card__flag";
  flag.src = c.flags?.svg || c.flags?.png || "";
  flag.alt = c.flags?.alt || `Flag of ${c.name.common}`;

  const heading = document.createElement("div");
  heading.className = "card__heading";

  const name = document.createElement("h2");
  name.className = "card__name";
  name.textContent = c.name.common;

  const official = document.createElement("p");
  official.className = "card__official";
  official.textContent = c.name.official;

  heading.appendChild(name);
  heading.appendChild(official);
  head.appendChild(flag);
  head.appendChild(heading);

  // Fact grid: capital, population, region, currencies
  const grid = document.createElement("div");
  grid.className = "card__grid";

  const capital = c.capital?.[0] || "Not available";
  const population = c.population.toLocaleString();
  const region = [c.subregion, c.region].filter(Boolean).join(", ") || c.region;
  const currencies = formatCurrencies(c.currencies);

  renderFact(grid, "Capital", capital);
  renderFact(grid, "Population", population);
  renderFact(grid, "Region", region, true);
  renderFact(grid, "Currencies", currencies, true);

  card.appendChild(head);
  card.appendChild(grid);
  out.appendChild(card);
}

/**
 * Fetches a country by name and walks through loading -> success/error.
 * @param {string} name
 */
async function showCountry(name) {
  const query = name.trim();
  if (!query) {
    renderError("Type a country name to look it up.");
    return;
  }

  renderLoading();

  try {
    const res = await fetch(`${API_BASE}${encodeURIComponent(query)}`);

    if (!res.ok) {
      // 404 = no match; anything else is a real HTTP error.
      throw new Error(
        res.status === 404 ? "Country not found" : `Request failed (${res.status})`
      );
    }

    const data = await res.json();
    const [country] = data;
    renderCountry(country);
  } catch (err) {
    // Covers both network failures (fetch rejects) and the errors thrown above.
    const friendly =
      err.message === "Failed to fetch"
        ? "Couldn't reach the network. Check your connection and try again."
        : err.message || "Something went wrong. Please try again.";
    renderError(friendly);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  showCountry(input.value);
});

// Default the page to Ethiopia on first load.
showCountry(DEFAULT_COUNTRY);