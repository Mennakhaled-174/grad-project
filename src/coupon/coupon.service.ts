import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { nanoid } from 'nanoid';

import { Coupon, CouponDocument } from '../DB/coupon.model';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponService {

  constructor(
    @InjectModel(Coupon.name)
    private couponModel: Model<CouponDocument>,
  ) {}

  // =========================
  // GENERATE CODE (admin)
  // =========================
  async generateCode(createCouponDto: CreateCouponDto) {
    const code = nanoid(8).toUpperCase();

    const coupon = await this.couponModel.create({
      code,
      discountPercent: createCouponDto.discountPercent,
      expiresAt:       createCouponDto.expiresAt,
    });

    return {
      message: 'Coupon generated successfully',
      coupon,
    };
  }

  // =========================
  // VALIDATE & APPLY
  // =========================
  async validateAndApply(
    code: string,
    price: number,
    userId: Types.ObjectId,
  ) {
     //console.log('validateAndApply called with userId:', userId); // ← add this
    const coupon = await this.couponModel.findOne({ code });

    if (!coupon) {
      throw new BadRequestException('Invalid promo code');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Promo code is inactive');
    }

    if (coupon.expiresAt < new Date()) {
      throw new BadRequestException('Promo code has expired');
    }

    // Check if this user already used this coupon
    const alreadyUsed = coupon.usedBy?.some(
      id => id.toString() === userId.toString()
    );

    if (alreadyUsed) {
      throw new BadRequestException(
        'You have already used this promo code'
      );
    }

    // Add userId to usedBy and increment usedCount
    await this.couponModel.findByIdAndUpdate(coupon._id, {
      $inc:  { usedCount: 1 },
      $push: { usedBy: userId },
    });

    const discountPercent = coupon.discountPercent;
    const finalPrice      = Math.round(price - (price * discountPercent / 100));

    return { finalPrice, discountPercent };
  }

  // =========================
  // VALIDATE ONLY (for frontend preview)
  // =========================
  async validateOnly(code: string, price: number) {
    const coupon = await this.couponModel.findOne({ code });

    if (!coupon) {
      throw new BadRequestException('Invalid promo code');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Promo code is inactive');
    }

    if (coupon.expiresAt < new Date()) {
      throw new BadRequestException('Promo code has expired');
    }

    const discountPercent = coupon.discountPercent;
    const finalPrice      = Math.round(price - (price * discountPercent / 100));

    return { finalPrice, discountPercent };
  }

  // =========================
  // GET ALL COUPONS (admin)
  // =========================
  async getAllCoupons() {
    const coupons = await this.couponModel
      .find()
      .sort({ createdAt: -1 });

    return {
      message: 'Coupons fetched successfully',
      coupons,
    };
  }
}