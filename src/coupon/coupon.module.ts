import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { CouponController }
  from './coupon.controller';

import { CouponService }
  from './coupon.service';

import {
  Coupon,
  CouponSchema,
} from '../DB/coupon.model';
import { User, userSchema } from '../DB/user.model';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: User.name, schema: userSchema }
    ]),
  ],
  controllers: [CouponController],
  providers:   [CouponService],
  exports:     [CouponService], // ← so booking module can use it
})
export class CouponModule {}