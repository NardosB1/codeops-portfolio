import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class OrderLineDto {
  @IsString({ message: 'dishId must be a string.' })
  @IsNotEmpty({ message: 'dishId is required.' })
  dishId: string;

  @IsInt({ message: 'quantity must be an integer.' })
  @Min(1, { message: 'quantity must be at least 1.' })
  quantity: number;
}
