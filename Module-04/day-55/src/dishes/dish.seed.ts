import type { Dish } from "./dish.interface.js";

export const DISH_SEED: Dish[] = [
  { id: 1, restaurantId: 1, name: "Doro Wat", priceSantim: 32000 },
  { id: 2, restaurantId: 1, name: "Shiro", priceSantim: 18000 },
  { id: 3, restaurantId: 2, name: "Kitfo", priceSantim: 28000 },
  { id: 4, restaurantId: 2, name: "Tibs", priceSantim: 25000 },
  { id: 5, restaurantId: 3, name: "Firfir", priceSantim: 15000 },
  { id: 6, restaurantId: 3, name: "Dulet", priceSantim: 22000 },
  { id: 7, restaurantId: 4, name: "Misir Wat", priceSantim: 14000 },
  { id: 8, restaurantId: 4, name: "Beyaynetu", priceSantim: 20000 },
];