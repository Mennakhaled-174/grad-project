import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CouponService }
  from './coupon.service';

import { CreateCouponDto }
  from './dto/create-coupon.dto';
import { RolesGuard } from '../common/Guard/role.guard';
import { Roles } from '../common/Decorators/roles.decorater';
import { userRole } from '../common/Types/types';
import { AuthGuard } from '../common/Guard/auth.guard';

@Controller('coupon')
export class CouponController {

  constructor(
    private readonly couponService: CouponService,
  ) {}

  // GENERATE CODE

@Roles(userRole.ADMIN)
@UseGuards(AuthGuard,RolesGuard)
  @Post('add')
  generate(
    @Body() createCouponDto: CreateCouponDto,
  ) {
    return this.couponService
      .generateCode(createCouponDto);
  }

  @Roles(userRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('all')
  getAllCoupons() {
    return this.couponService.getAllCoupons();
  }
 
@UseGuards(AuthGuard)
  @Post('validate')
  validateCoupon(
    @Req() req: any,
    @Body() body: { code: string; price: number },
  ) {
    return this.couponService.validateOnly(body.code, body.price);
  }
 
}