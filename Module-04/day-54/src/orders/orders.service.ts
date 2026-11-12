import { Inject, Injectable } from "@nestjs/common";
import type { Area, Order } from "./order.types.js";
import { OrderNotFoundError } from "./order.errors.js";
import { ORDER_REPOSITORY } from "./order.tokens.js";
import type { OrderRepository } from "./order.repository.js";
import type { CreateOrderDto } from "./dto/create-order.dto.js";

// Same rule as Day 52/53, all amounts in santim.
const FREE_DELIVERY_ABOVE_SANTIM = 500 * 100;
const BOLE_FEE_SANTIM = 40 * 100;
const OTHER_AREA_FEE_SANTIM = 60 * 100;

function deliveryFee(order: Order): number {
  if (order.totalSantim > FREE_DELIVERY_ABOVE_SANTIM) return 0;
  return order.area === "Bole" ? BOLE_FEE_SANTIM : OTHER_AREA_FEE_SANTIM;
}

@Injectable()
export class OrdersService {
  constructor(@Inject(ORDER_REPOSITORY) private readonly repo: OrderRepository) {}

  // ---- Day 53, unchanged ----

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

  // ---- Day 54 additions ----

  findAll(area?: string): Order[] {
    const all = this.repo.all();
    return area ? all.filter((order) => order.area === area) : all;
  }

  create(dto: CreateOrderDto): Order {
    return this.repo.create({
      customer: dto.customer,
      area: dto.area,
      status: "placed",
      dishes: [],
      phone: dto.phone,
      totalSantim: dto.totalSantim,
    });
  }
}