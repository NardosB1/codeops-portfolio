import { Inject, Injectable } from "@nestjs/common";
import { RESTAURANT_SEED } from "../restaurants/restaurant.seed.js";
import type { CreateDishDto } from "./dto/create-dish.dto.js";
import type { Dish } from "./dish.interface.js";
import type { DishRepository } from "./dish.repository.js";
import { DISH_REPOSITORY } from "./dish.tokens.js";

// Only Injectable and Inject come from @nestjs/common (they are what makes DI work).
// No HTTP exception classes here: the controller decides the status codes.
@Injectable()
export class DishesService {
  constructor(@Inject(DISH_REPOSITORY) private readonly repo: DishRepository) {}

  findAll(restaurantId?: number): Dish[] {
    return restaurantId === undefined ? this.repo.all() : this.repo.byRestaurant(restaurantId);
  }

  findOne(id: number): Dish | undefined {
    return this.repo.byId(id);
  }

  restaurantExists(restaurantId: number): boolean {
    return RESTAURANT_SEED.some((restaurant) => restaurant.id === restaurantId);
  }

  create(dto: CreateDishDto): Dish {
    return this.repo.add({
      restaurantId: dto.restaurantId,
      name: dto.name,
      priceSantim: dto.priceSantim,
    });
  }
}