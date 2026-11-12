import type { Area, Order } from "./order.types";
import { OrderNotFoundError } from "./order.errors";
import type { OrderRepository } from "./order.repository";

// Same rule as Day 52, all amounts in santim.
const FREE_DELIVERY_ABOVE_SANTIM = 500 * 100;
const BOLE_FEE_SANTIM = 40 * 100;
const OTHER_AREA_FEE_SANTIM = 60 * 100;

function deliveryFee(order: Order): number {
  if (order.totalSantim > FREE_DELIVERY_ABOVE_SANTIM) return 0;
  return order.area === "Bole" ? BOLE_FEE_SANTIM : OTHER_AREA_FEE_SANTIM;
}

export class OrderService {
  constructor(private readonly repo: OrderRepository) {}

  find(id: number): Order {
    const hit = this.repo.byId(id);
    if (!hit) throw new OrderNotFoundError(id);
    return hit;
  }

  // Total delivery fees (in santim) collected per area.
  feesByArea(): Record<Area, number> {
    const totals: Record<Area, number> = {
      Bole: 0,
      Kazanchis: 0,
      Piassa: 0,
      Megenagna: 0,
    };
    for (const order of this.repo.all()) {
      totals[order.area] += deliveryFee(order);
    }
    return totals;
  }

  summarise<K extends keyof Order>(key: K): Order[K][] {
    return this.repo.all().map((order) => order[key]);
  }
}
