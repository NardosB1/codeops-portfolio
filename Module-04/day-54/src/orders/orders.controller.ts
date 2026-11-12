import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseFilters } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto.js";
import { OrderNotFoundFilter } from "./order-not-found.filter.js";
import type { Order } from "./order.types.js";
import { OrdersService } from "./orders.service.js";

@Controller("orders")
@UseFilters(OrderNotFoundFilter)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  findAll(@Query("area") area?: string): Order[] {
    return this.orders.findAll(area);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Order {
    return this.orders.find(id);
  }

  @Post()
  create(@Body() dto: CreateOrderDto): Order {
    return this.orders.create(dto);
  }
}