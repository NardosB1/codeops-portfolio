// Scratch file: imports everything through the barrel (./orders).
import {
  InMemoryOrderRepository,
  OrderNotFoundError,
  OrderService,
  PaymentDeclinedError,
  type Order,
} from "./orders";

const orders: Order[] = [
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

const service = new OrderService(new InMemoryOrderRepository(orders));

console.log("find(2).customer:", service.find(2).customer);
console.log("feesByArea (santim):", service.feesByArea());
console.log("summarise('customer'):", service.summarise("customer"));
console.log("summarise('totalSantim'):", service.summarise("totalSantim"));

try {
  service.find(999);
} catch (error) {
  if (error instanceof OrderNotFoundError) {
    console.log(`Caught OrderNotFoundError: ${error.message} (id=${error.id})`);
  } else {
    throw error;
  }
}

const declined = new PaymentDeclinedError("0911000001", "insufficient balance");
console.log(`${declined.name}: phone=${declined.phone}, reason=${declined.reason}`);

// Build-time checks. This function is never called; it only has to compile.
// If summarise lost its precise typing, the first @ts-expect-error would itself be an error.
export function typeChecks(): void {
  const customers = service.summarise("customer"); // inferred: string[]
  const totals = service.summarise("totalSantim"); // inferred: number[]

  // @ts-expect-error customers is string[], so a number method must not compile
  customers[0].toFixed();

  // @ts-expect-error "name" is not a key of Order
  service.summarise("name");

  console.log(totals.length);
}