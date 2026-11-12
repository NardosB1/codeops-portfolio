import type { Dish } from "./dish.interface.js";

export interface DishRepository {
  all(): Dish[];
  byId(id: number): Dish | undefined;
  byRestaurant(restaurantId: number): Dish[];
  add(draft: Omit<Dish, "id">): Dish;
}

export class InMemoryDishRepository implements DishRepository {
  private readonly dishes = new Map<number, Dish>();

  constructor(seed: readonly Dish[] = []) {
    for (const dish of seed) this.dishes.set(dish.id, { ...dish });
  }

  all(): Dish[] {
    return [...this.dishes.values()];
  }

  byId(id: number): Dish | undefined {
    return this.dishes.get(id);
  }

  byRestaurant(restaurantId: number): Dish[] {
    return this.all().filter((dish) => dish.restaurantId === restaurantId);
  }

  add(draft: Omit<Dish, "id">): Dish {
    const id = Math.max(0, ...this.dishes.keys()) + 1;
    const dish: Dish = { ...draft, id };
    this.dishes.set(id, dish);
    return dish;
  }
}