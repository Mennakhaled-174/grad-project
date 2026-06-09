import {
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class CreateCouponDto {

  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercent!: number;

  @IsDateString()
  expiresAt!: string;

  
}