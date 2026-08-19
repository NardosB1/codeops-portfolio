const STORAGE_KEY = "addiseats-cart";
const FREE_DELIVERY_OVER = 500; // ETB – example magic value lifted
const PHONE_REGEX = /(?:\+251|0)9\d{8}/; // Ethiopian mobile number pattern

const state = {
    dishes: [],
    cart: [],          // [{ id, name, price, qty }]
    search: ""
};

// DOM refs
const menuEl   = document.getElementById("menu");
const cartItemsEl = document.getElementById("cart-items");
const totalEl  = document.getElementById("cart-total");
const searchEl = document.getElementById("search");
const formEl   = document.getElementById("checkout");
const errorEl  = document.getElementById("form-error");
const confirmEl = document.getElementById("confirmation");
const confirmMsg = document.getElementById("confirm-msg");

// Pure helpers
function calcTotal() {
  return state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function validate({ name, phone }) {
    if (!name.trim()) return "Please enter your name.";
    if (!PHONE_REGEX.test(phone)) return "Enter a valid Ethiopian phone (09xxxxxxxx or +2519xxxxxxxx).";
    if (state.cart.length === 0) return "Your cart is empty.";
    return ""; // success
}

// Persistence
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
}

function loadCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) state.cart = JSON.parse(raw);
    } catch {
        state.cart = [];
    }
}

// Render
function renderMenu() {
    const term = state.search.toLowerCase().trim();
    const filtered = state.dishes.filter(d => d.name.toLowerCase().includes(term) || d.category.toLowerCase().includes(term));

    if (filtered.length === 0) {
        menuEl.innerHTML = "<p>No dishes match your search.</p>";
    return;
    }

menuEl.innerHTML = filtered.map(dish => `
    <article class="dish" data-id="${dish.id}">
    <img src="${dish.image}" alt="${dish.name}" />
    <h3>${dish.name}</h3>
    ${dish.spicy ? '<span class="spicy">Spicy</span>' : ''}
    <p class="price">${dish.price} ETB</p>
    <button data-action="add">Add to cart</button>
    </article> `).join("");
}

function renderCart() {
  // Guard clause – empty cart
if (state.cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty</p>";
    totalEl.textContent = "0 ETB";
    return;
}

cartItemsEl.innerHTML = state.cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
    <span>${item.name} × ${item.qty}</span>
    <div class="qty-controls">
        <button data-action="dec">−</button>
        <button data-action="inc">+</button>
        <button data-action="remove">✕</button>
    </div>
      <span>${item.price * item.qty} ETB</span>
    </div> `).join("");

const total = calcTotal();
    totalEl.textContent = `${total} ETB`;
}

function render() {
    renderMenu();
    renderCart();
}

// Event handlers(delegation)
function handleMenuClick(e) {
    const btn = e.target.closest("[data-action='add']");
    if (!btn) return;
    const card = btn.closest(".dish");
    const id = Number(card.dataset.id);
    const dish = state.dishes.find(d => d.id === id);
    if (!dish) return;

    const existing = state.cart.find(c => c.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        state.cart.push({ id: dish.id, name: dish.name, price: dish.price, qty: 1 });
    }
save();
render();
}

function handleCartClick(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const row = btn.closest(".cart-item");
    const id = Number(row.dataset.id);
    const item = state.cart.find(c => c.id === id);
    if (!item) return;

    const action = btn.dataset.action;
    if (action === "inc") item.qty += 1;
    if (action === "dec") {
        item.qty -= 1;
    if (item.qty <= 0) state.cart = state.cart.filter(c => c.id !== id);
    }
    if (action === "remove") {
        state.cart = state.cart.filter(c => c.id !== id);
    }
save();
render();
}

function handleSearch() {
    state.search = searchEl.value;
    render();
}

function handleCheckout(e) {
    e.preventDefault();
    const name  = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const area  = document.getElementById("area").value;

    const msg = validate({ name, phone });
    if (msg) {
        errorEl.textContent = msg;
    return;
    }
    errorEl.textContent = "";

  // Build order object
const order = {
    name,
    phone,
    area,
    items: [...state.cart],
    total: calcTotal(),
    placedAt: new Date().toISOString()
    };

console.log("Order placed:", order); 

// Clear cart & show confirmation
state.cart = [];
    save();
    render();

confirmMsg.textContent = `Order confirmed! Total ${order.total} ETB. Thank you, ${name}.`;
confirmEl.classList.remove("hidden");
}

// Init 
async function init() {
    loadCart();

try {
    const res = await fetch("./data/menu.json");
    if (!res.ok) throw new Error("Network response was not ok");
    state.dishes = await res.json();
} catch (err) {
    menuEl.innerHTML = `<p class="error">Could not load menu. Please try again later.</p>`;
    console.error(err);
    return;
}

render();

// Event listeners
menuEl.addEventListener("click", handleMenuClick);
cartItemsEl.addEventListener("click", handleCartClick);
searchEl.addEventListener("input", handleSearch);
formEl.addEventListener("submit", handleCheckout);
document.getElementById("close-confirm").addEventListener("click", () => {
    confirmEl.classList.add("hidden");
    });
}

init();