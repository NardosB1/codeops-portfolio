import { Module } from "@nestjs/common";
import { InMemoryOrderRepository } from "./order.repository.js";
import { ORDER_SEED } from "./order.seed.js";
import { ORDER_REPOSITORY } from "./order.tokens.js";
import { OrdersController } from "./orders.controller.js";
import { OrdersService } from "./orders.service.js";

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDER_REPOSITORY,
      useFactory: () => new InMemoryOrderRepository(ORDER_SEED),
    },
  ],
})
export class OrdersModule {}