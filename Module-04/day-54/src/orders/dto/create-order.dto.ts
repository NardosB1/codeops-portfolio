import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from "class-validator";
import { AREAS, type Area } from "../order.types.js";

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customer!: string;

  @IsIn(AREAS)
  area!: Area;

  @IsInt()
  @Min(1)
  totalSantim!: number;

  // Optional TeleBirr number: digits only, with an optional leading +
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{9,15}$/)
  phone?: string;
}