import type { Order } from "./order.types";

export interface OrderRepository {
  all(): Order[];
  byId(id: number): Order | undefined;
}

export class InMemoryOrderRepository implements OrderRepository {
  constructor(private readonly orders: Order[]) {}

  all(): Order[] {
    return [...this.orders];
  }

  byId(id: number): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }
}
