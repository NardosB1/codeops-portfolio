import { Order } from "./order.types.js";

export interface OrderRepository {
  byId(id: number): Order | undefined;
  all(): Order[];
  create(draft: Omit<Order, "id">): Order; // added on Day 54 so POST has a write path
}

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<number, Order>();

  constructor(seed: readonly Order[] = []) {
    for (const order of seed) this.add(order);
  }

  add(order: Order): void {
    this.orders.set(order.id, order);
  }

  byId(id: number): Order | undefined {
    return this.orders.get(id);
  }

  all(): Order[] {
    return [...this.orders.values()];
  }

  create(draft: Omit<Order, "id">): Order {
    const id = Math.max(0, ...this.orders.keys()) + 1;
    const order: Order = { ...draft, id };
    this.add(order);
    return order;
  }
}