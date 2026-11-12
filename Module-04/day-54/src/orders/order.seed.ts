import type { Order } from "./order.types.js";

export const ORDER_SEED: Order[] = [
  {
    id: 1,
    customer: "Hana Tesfaye",
    area: "Bole",
    status: "preparing",
    dishes: [{ name: "Doro Wat", priceSantim: 45000 }],
    phone: "0911000001",
    totalSantim: 45000,
  },
  {
    id: 2,
    customer: "Dawit Alemu",
    area: "Piassa",
    status: "placed",
    dishes: [{ name: "Special Tibs", priceSantim: 62000 }],
    totalSantim: 62000,
  },
  {
    id: 3,
    customer: "Selam Bekele",
    area: "Kazanchis",
    status: "delivered",
    dishes: [{ name: "Shiro", priceSantim: 30000 }],
    totalSantim: 30000,
  },
];