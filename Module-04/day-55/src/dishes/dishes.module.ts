import { Module } from "@nestjs/common";
import { DISH_SEED } from "./dish.seed.js";
import { InMemoryDishRepository } from "./dish.repository.js";
import { DISH_REPOSITORY } from "./dish.tokens.js";
import { DishesController } from "./dishes.controller.js";
import { DishesService } from "./dishes.service.js";

@Module({
  controllers: [DishesController],
  providers: [
    DishesService,
    {
      provide: DISH_REPOSITORY,
      useFactory: () => new InMemoryDishRepository(DISH_SEED),
    },
  ],
})
export class DishesModule {}