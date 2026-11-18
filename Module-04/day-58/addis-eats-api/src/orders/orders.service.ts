import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

interface Restaurant {
  id: string;
  name: string;
  isOpen: boolean;
}

interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  priceSantim: number;
}

export interface OrderRecord {
  id: string;
  restaurantId: string;
  customerPhone: string;
  deliveryType: 'DELIVERY' | 'PICKUP';
  deliveryAddress?: string;
  lines: { dishId: string; quantity: number; unitPriceSantim: number }[];
  tipSantim: number;
  totalSantim: number;
  status: OrderStatus;
  createdAt: string;
}

@Injectable()
export class OrdersService {
  // Status-transition table keyed on OrderStatus
  private readonly statusTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    [OrderStatus.PREPARING]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELLED],
    [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  private readonly restaurants: Map<string, Restaurant> = new Map([
    ['rest-1', { id: 'rest-1', name: 'Yod Abyssinia', isOpen: true }],
    ['rest-closed', { id: 'rest-closed', name: 'Closed Kitchen', isOpen: false }],
  ]);

  private readonly dishes: Map<string, Dish> = new Map([
    ['dish-1', { id: 'dish-1', restaurantId: 'rest-1', name: 'Special Kitfo', priceSantim: 35000 }],
    ['dish-2', { id: 'dish-2', restaurantId: 'rest-1', name: 'Doro Wat', priceSantim: 42000 }],
    ['dish-other', { id: 'dish-other', restaurantId: 'rest-closed', name: 'Shiro', priceSantim: 18000 }],
  ]);

  private readonly orders: Map<string, OrderRecord> = new Map([
    [
      'ord-delivered',
      {
        id: 'ord-delivered',
        restaurantId: 'rest-1',
        customerPhone: '0911223344',
        deliveryType: 'PICKUP',
        lines: [{ dishId: 'dish-1', quantity: 1, unitPriceSantim: 35000 }],
        tipSantim: 0,
        totalSantim: 35000,
        status: OrderStatus.DELIVERED,
        createdAt: '2026-11-19T00:00:00.000Z',
      },
    ],
  ]);

  create(dto: CreateOrderDto): OrderRecord {
    // 1. EXISTENCE GUARDS
    const restaurant = this.restaurants.get(dto.restaurantId);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant '${dto.restaurantId}' not found.`);
    }

    const resolvedDishes: Dish[] = [];
    for (const line of dto.lines) {
      const dish = this.dishes.get(line.dishId);
      if (!dish) {
        throw new NotFoundException(`Dish '${line.dishId}' not found.`);
      }
      resolvedDishes.push(dish);
    }

    // 2. STATE GUARDS
    if (!restaurant.isOpen) {
      throw new ConflictException(`Restaurant '${restaurant.name}' is currently closed.`);
    }

    // 3. RELATIONSHIP GUARDS
    for (const dish of resolvedDishes) {
      if (dish.restaurantId !== restaurant.id) {
        throw new BadRequestException(
          `Dish '${dish.id}' does not belong to restaurant '${restaurant.id}'.`,
        );
      }
    }

    // 4. WORK & SERVER-SIDE COMPUTATION
    let subtotalSantim = 0;
    const computedLines = dto.lines.map((line) => {
      const dish = this.dishes.get(line.dishId)!;
      subtotalSantim += dish.priceSantim * line.quantity;
      return {
        dishId: dish.id,
        quantity: line.quantity,
        unitPriceSantim: dish.priceSantim,
      };
    });

    const tipSantim = dto.tipSantim ?? 0;
    const totalSantim = subtotalSantim + tipSantim;

    const order: OrderRecord = {
      id: `ord-${this.orders.size + 1}`,
      restaurantId: restaurant.id,
      customerPhone: dto.customerPhone,
      deliveryType: dto.deliveryType,
      deliveryAddress: dto.deliveryAddress,
      lines: computedLines,
      tipSantim,
      totalSantim,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    this.orders.set(order.id, order);
    return order;
  }

  updateStatus(orderId: string, nextStatus: OrderStatus): OrderRecord {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundException(`Order '${orderId}' not found.`);
    }

    const allowedNext = this.statusTransitions[order.status];
    if (!allowedNext.includes(nextStatus)) {
      throw new ConflictException(
        `Cannot transition order from ${order.status} to ${nextStatus}.`,
      );
    }

    order.status = nextStatus;
    return order;
  }

  findAll(): OrderRecord[] {
    return Array.from(this.orders.values());
  }

  triggerForcedTypeError(): never {
    const obj: any = null;
    // Deliberate TypeError to verify generic 500 handling with zero stack trace leak
    return obj.nonExistentMethod();
  }
}
