const API_BASE = "https://addis-eats-backend.onrender.com";

async function getJson(path) {
const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) {
        throw new Error(`Request to ${path} failed with status ${res.status}`);
}
const body = await res.json();
    return body.data;
}

export function fetchDishes() {
    return getJson("/menu/");
}

export function fetchSpecials() {
    return getJson("/menu/specials");
}


export async function fetchDishById(id) {
const dishes = await fetchDishes();
const dish = dishes.find((d) => d.id === id);
    if (!dish) {
        throw new Error(`No dish with id "${id}"`);
}
    return dish;
}