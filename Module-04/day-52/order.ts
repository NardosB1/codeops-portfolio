// ---------- Types ----------

export const AREAS = ["Bole", "Kazanchis", "Piassa", "Megenagna"] as const;
export type Area = (typeof AREAS)[number];

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered";

export type Dish = { name: string; priceSantim: number };

export type Order = {
  readonly id: number;
  customer: string;
  area: Area;
  status: OrderStatus;
  dishes: Dish[];
  phone?: string; // TeleBirr number, optional
  totalSantim: number;
};

// ---------- Money helper: the ONLY place an ETB amount is formatted ----------

const etbFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "ETB",
});

export function formatEtb(santim: number): string {
  return etbFormatter.format(santim / 100); // 100 santim = 1 ETB
}

// ---------- Business rules ----------

const FREE_DELIVERY_ABOVE_SANTIM = 500 * 100; // 500 ETB
const BOLE_FEE_SANTIM = 40 * 100; // 40 ETB
const OTHER_AREA_FEE_SANTIM = 60 * 100; // 60 ETB

export function deliveryFee(order: Order): number {
  if (order.totalSantim > FREE_DELIVERY_ABOVE_SANTIM) return 0;
  return order.area === "Bole" ? BOLE_FEE_SANTIM : OTHER_AREA_FEE_SANTIM;
}

export function statusMessage(status: OrderStatus): string {
  switch (status) {
    case "placed":
      return "We have your order and are waiting for the kitchen to accept it.";
    case "confirmed":
      return "The kitchen has confirmed your order.";
    case "preparing":
      return "Your food is being prepared.";
    case "out_for_delivery":
      return "Your order is on its way.";
    case "delivered":
      return "Delivered. Enjoy your meal!";
    default: {
      const unreachable: never = status;
      throw new Error(`Unhandled status: ${String(unreachable)}`);
    }
  }
}

export function receipt(order: Order): string {
  const fee = deliveryFee(order);
  const dishLines = order.dishes
    .map((dish) => `  ${dish.name.padEnd(18)} ${formatEtb(dish.priceSantim)}`)
    .join("\n");

  return `ADDIS EATS - Order #${order.id}
Customer: ${order.customer}
Area:     ${order.area}
TeleBirr: ${order.phone ?? "not provided"}
Status:   ${statusMessage(order.status)}
------------------------------------
${dishLines}
------------------------------------
Food:     ${formatEtb(order.totalSantim)}
Delivery: ${formatEtb(fee)}
To pay:   ${formatEtb(order.totalSantim + fee)}`;
}

//Demo

const sampleDishes: Dish[] = [
  { name: "Doro Wat", priceSantim: 22000 },
  { name: "Shiro", priceSantim: 18000 },
];

const sampleOrders: Order[] = [
  {
    // 400 ETB to Bole -> 40 ETB delivery
    id: 1001,
    customer: "Hana Tesfaye",
    area: "Bole",
    status: "preparing",
    dishes: sampleDishes,
    phone: "0911000001",
    totalSantim: sampleDishes.reduce((sum, dish) => sum + dish.priceSantim, 0),
  },
  {
    // 550 ETB (above 500) -> free delivery
    id: 1002,
    customer: "Dawit Alemu",
    area: "Piassa",
    status: "placed",
    dishes: [{ name: "Special Tibs", priceSantim: 55000 }],
    totalSantim: 55000,
  },
  {

    id: 1003,
    customer: "Selam Bekele",
    area: "Megenagna",
    status: "out_for_delivery",
    dishes: [{ name: "Kitfo", priceSantim: 30000 }],
    phone: "0922000002",
    totalSantim: 30000,
  },
];

for (const order of sampleOrders) {
  console.log(receipt(order));
  console.log();
}