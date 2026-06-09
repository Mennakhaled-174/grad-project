import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Coupon {

  @Prop({ required: true, type: String, unique: true })
  code!: string;

  @Prop({ required: true, type: Number, min: 1, max: 100 })
  discountPercent!: number;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;

  @Prop({ required: true, type: Date })
  expiresAt!: Date;

  @Prop({ type: Number, default: 0 })
  usedCount!: number;

  // Stores which users have already used this coupon
  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  usedBy!: Types.ObjectId[];
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
export type CouponDocument = HydratedDocument<Coupon>;