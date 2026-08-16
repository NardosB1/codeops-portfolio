// ============================================
// Addis Market — Shopping List
// Pure DOM + events, no framework.
// The DOM itself is the source of truth: each <li> row
// carries its price in a data attribute (dataset.price),
// so we never need a separate JS array to stay in sync.
// ============================================

// --- Cache element references once ---
const form = document.querySelector("#add-form");
const nameInput = document.querySelector("#name");
const priceInput = document.querySelector("#price");
const list = document.querySelector("#list");
const totalEl = document.querySelector("#total");
const emptyState = document.querySelector("#empty-state");

// --- Helpers ---

// Format a number as an ETB amount, e.g. 1250 -> "1,250.00 ETB"
function formatETB(amount) {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} ETB`;
}

// Build one <li> row for an item using createElement/append
// (never innerHTML/string building — required so we're not
// throwing away and rebuilding the whole list on every change).
function createItemRow(itemName, itemPrice) {
  const li = document.createElement("li");
  li.className = "item";
  // Store the price on the element itself so updateTotal() can
  // read it straight back out of the DOM later.
  li.dataset.price = itemPrice;

  const nameSpan = document.createElement("span");
  nameSpan.className = "item-name";
  nameSpan.textContent = itemName;

  const priceSpan = document.createElement("span");
  priceSpan.className = "item-price";
  priceSpan.textContent = formatETB(itemPrice);

  const delBtn = document.createElement("button");
  delBtn.type = "button"; // not "submit" — this button lives outside the form anyway
  delBtn.className = "del";
  delBtn.textContent = "×";
  delBtn.setAttribute("aria-label", `Remove ${itemName}`);

  li.append(nameSpan, priceSpan, delBtn);
  return li;
}

// Recalculate the total by reading every row currently in the DOM.
function updateTotal() {
  const rows = list.querySelectorAll("li");
  let total = 0;
  rows.forEach((row) => {
    total += Number(row.dataset.price);
  });
  totalEl.textContent = formatETB(total);
}

// Show/hide the "your list is empty" message based on row count.
function updateEmptyState() {
  const hasItems = list.children.length > 0;
  emptyState.classList.toggle("visible", !hasItems);
}

// --- Add item (form submit) ---
form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page from reloading

  const nameValue = nameInput.value.trim();
  const priceValue = Number(priceInput.value);

  // Validate: name must be non-empty, price must be a real positive number.
  // Number("") is 0 and Number("abc") is NaN — both are falsy, so !priceValue
  // catches empty/invalid input; the extra check catches 0 or negative prices.
  if (!nameValue || !priceValue || priceValue <= 0) {
    return;
  }

  const row = createItemRow(nameValue, priceValue);
  list.append(row);

  form.reset();
  nameInput.focus(); // ready for the next item
  updateTotal();
  updateEmptyState();
});

// --- Delete + toggle "bought" (single delegated listener) ---
list.addEventListener("click", (e) => {
  const deleteButton = e.target.closest(".del");

  if (deleteButton) {
    deleteButton.closest("li").remove();
    updateTotal();
    updateEmptyState();
    return; // don't also toggle "bought" on the row we just removed
  }

  const row = e.target.closest("li");
  if (row) {
    row.classList.toggle("bought"); // styling lives entirely in CSS
  }
});

// --- Initial render ---
updateTotal();
updateEmptyState();
