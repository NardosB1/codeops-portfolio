//async function fetchRates() {
//    const response = await fetch("https://open.er-api.com/v6/latest/ETB");
//    const data = await response.json();
//    console.log(data);
//}

//fetchRates();

const API = "https://open.er-api.com/v6/latest/ETB";

const state = {
    base: "ETB",
    rates: {}, 
    watchlist: [], 
    amount: 100,
    currency: "USD",
    status: "idle"
};



const form = document.querySelector("#convert-form");
const amount = document.querySelector("#amount");
const result = document.querySelector("#result");
const watchUl = document.querySelector("#watchlist");
const addWatchBtn = document.querySelector("#add-watch");


const status = document.querySelector("#status");
function renderStatus() {
    if (state.status === "loading") {
        status.textContent = "Loading rates...";
    } else if (state.status === "error") {
        status.textContent = "Could not load rates.";
    } else {
        status.textContent = "";
    }
}

async function loadRates() {
    status.status = "Loading rates...";
    renderStatus();
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        state.rates = data.rates; 
        state.status = "success";
        renderStatus();
        render();
    } catch (err) {
    status.status = "error";
    renderStatus();
    }
}


const select = document.querySelector("#currency");
function render() {
    const codes = Object.keys(state.rates);
    select.innerHTML = codes.map(c => `<option>${c}</option>`).join("");
    select.value = state.currency;
    renderWatchlist(); 
}


function renderWatchlist() {
    if (state.watchlist.length === 0) {
        watchUl.innerHTML = "<li>No currencies yet</li>";
        return;
    }
    watchUl.innerHTML = state.watchlist.map(c => {
        const r = state.rates[c];
        return `<li data-c="${c}">1 ETB = ${r} ${c}
<button class="rm">×</button></li>`;
}).join("");
}


addWatchBtn.addEventListener("click", () => {
    const c = select.value;
    if (!state.watchlist.includes(c)) {
        state.watchlist.push(c);
        save();
        renderWatchlist();
    }
});


watchUl.addEventListener("click", (e) => {
    if (!e.target.matches(".rm")) return;
    const c = e.target.closest("li").dataset.c;
    state.watchlist =
    state.watchlist.filter(x => x !== c);
    save();
    renderWatchlist();
});


form.addEventListener("submit", (e) => {
e.preventDefault();
    const amt = Number(amount.value);
    if (!amt || amt <= 0) {
        result.textContent = "Enter a valid amount.";
return;
    }
    state.amount = amt;
    state.currency = select.value;
    const rate = state.rates[state.currency];
    const out = (amt * rate).toFixed(2);
    result.textContent = `${amt} ETB = ${out} ${state.currency}`;
    save();
});


const KEY = "birrwatch";
function save() {
    localStorage.setItem(KEY, JSON.stringify({
        watchlist: state.watchlist,
        currency: state.currency,
        amount: state.amount,
    }));
}

function load() {
    const saved = localStorage.getItem(KEY);
    if (saved) Object.assign(state, JSON.parse(saved));
}

async function init() {
    load(); 
    await loadRates(); 
}

init();


