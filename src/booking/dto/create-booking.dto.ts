import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Validate,
} from 'class-validator';

import {
  cityEnum,
  paymentMethodEnum,
  promoCodeEnum,
  serviceTypeEnum,
  sizeTypeEnum,
} from '../../common/Types/types';

import { IsValidBookingTime } from '../../common/validators/bookingTime';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  fullname!: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('EG')
  phone!: string;

  @IsEnum(cityEnum)
  city!: cityEnum;

  @IsString()
  @IsNotEmpty()
  addressDetails!: string;

  @IsString()
  @IsNotEmpty()
  building!: string;

  @IsString()
  @IsNotEmpty()
  floor!: string;

  @IsString()
  @IsNotEmpty()
  apartment!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsValidBookingTime)
  time!: string;

  @IsEnum(serviceTypeEnum)
  service!: serviceTypeEnum;

  @IsEnum(sizeTypeEnum)
  size!: sizeTypeEnum;

  @IsEnum(paymentMethodEnum)
  paymentMethod!: paymentMethodEnum;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
