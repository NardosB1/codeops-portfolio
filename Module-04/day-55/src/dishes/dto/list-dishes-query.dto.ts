import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

// Query strings arrive as text, so @Type converts "1" to 1 before validation.
export class ListDishesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  restaurantId?: number;
}