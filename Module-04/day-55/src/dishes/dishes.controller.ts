import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateDishDto } from "./dto/create-dish.dto.js";
import { ListDishesQueryDto } from "./dto/list-dishes-query.dto.js";
import type { Dish } from "./dish.interface.js";
import { DishesService } from "./dishes.service.js";

@Controller("dishes")
export class DishesController {
  constructor(private readonly dishes: DishesService) {}

  @Get()
  findAll(@Query() query: ListDishesQueryDto): Dish[] {
    return this.dishes.findAll(query.restaurantId);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Dish {
    const dish = this.dishes.findOne(id);
    if (!dish) throw new NotFoundException(`Dish ${id} not found`);
    return dish;
  }

  // 422: the body is well-formed and passes validation, but it points at a
  // restaurant that does not exist. (400 is kept for malformed/invalid fields.)
  @Post()
  create(@Body() dto: CreateDishDto): Dish {
    if (!this.dishes.restaurantExists(dto.restaurantId)) {
      throw new UnprocessableEntityException(`Restaurant ${dto.restaurantId} does not exist`);
    }
    return this.dishes.create(dto);
  }
}