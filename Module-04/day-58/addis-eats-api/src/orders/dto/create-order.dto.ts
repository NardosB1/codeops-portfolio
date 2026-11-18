import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsIn,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderLineDto } from './order-line.dto';
import { IsTeleBirrNumber } from '../../common/validators/is-telebirr.validator';
import { IsSantim } from '../../common/validators/santim.validator';
import { IsAddressRequiredForDelivery } from '../../common/validators/cross-field-delivery.validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'restaurantId is required.' })
  restaurantId: string;

  @IsTeleBirrNumber()
  customerPhone: string;

  @IsIn(['DELIVERY', 'PICKUP'], {
    message: 'deliveryType must be either DELIVERY or PICKUP.',
  })
  deliveryType: 'DELIVERY' | 'PICKUP';

  @IsOptional()
  @IsString()
  @IsAddressRequiredForDelivery()
  deliveryAddress?: string;

  @IsOptional()
  @IsSantim()
  tipSantim?: number;

  @IsArray({ message: 'lines must be an array.' })
  @ArrayMinSize(1, { message: 'Order must include at least one item.' })
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  lines: OrderLineDto[];
}
