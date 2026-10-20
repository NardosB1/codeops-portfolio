const NEIGHBOURHOODS = ["Bole", "Piassa", "Kazanchis", "CMC", "Sarbet", "Megenagna", "Gerji"];
const NAMES = ["Abebe", "Hana", "Dawit", "Selam", "Yonas", "Meron", "Kidus", "Tigist"];
const START = Date.UTC(2026, 9, 1); 
export const DAYS = 14;
export const RANGE_LABEL = "1–14 Oct 2026";

const ALL = Array.from({ length: 60 }, (_, i) => ({
id: 1001 + i,
  customer: `${NAMES[i % 8]} ${String.fromCharCode(65 + ((i * 7) % 26))}.`,
  neighbourhood: NEIGHBOURHOODS[(i * 3) % 7],
  total: 250 + ((i * 137) % 900),
  date: new Date(START + ((i * 5 + (i >> 2)) % DAYS) * 86400000).toISOString().slice(0, 10),
}));

export function dayList() {
return Array.from({ length: DAYS }, (_, d) =>
    new Date(START + d * 86400000).toISOString().slice(0, 10)
);
}

export async function getOrders(state) {
    await new Promise((r) => setTimeout(r, 1500)); 
if(state === "error") throw new Error("Could not load orders.");
if(state === "empty") return [];
    return ALL;
}