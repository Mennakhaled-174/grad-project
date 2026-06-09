import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { cityEnum, paymentMethodEnum, BookingStatus, promoCodeEnum } from "../common/Types/types";
import { User } from "./user.model";

@Schema({ timestamps: true })
export class Booking {

  @Prop({ required: true, type: String, trim: true, lowercase: true })
  fullname!: string;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  userId!: Types.ObjectId;

  @Prop({ required: true, type: String })
  phone!: string;

  @Prop({ required: true, type: String, enum: cityEnum, default: cityEnum.Cairo })
  city!: string;

  @Prop({ required: true, type: String })
  addressDetails!: string;

  @Prop({ required: true, type: String })
  building!: string;

  @Prop({ required: true, type: String })
  floor!: string;

  @Prop({ required: true, type: String })
  apartment!: string;

  @Prop({ required: true, type: Date })
  date!: Date;

  @Prop({ required: true, type: String })
  time!: string;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status!: string;

  @Prop({ required: true, type: String, enum: paymentMethodEnum, default: paymentMethodEnum.CASH })
  paymentMethod!: string;

  @Prop({ type: String, enum: ['pending', 'paid'], default: 'pending' })
  paymentStatus!: string;

  @Prop({ type: Number, default: 0 })
  totalPrice!: number;

  @Prop({ type: Number, default: 0 })
  workerEarnings!: number;

  @Prop({ type: Types.ObjectId, ref: 'Worker', default: null })
  workerId!: Types.ObjectId;

  @Prop({ type: String, default: null })
  rejectionReason!: string;

  @Prop({ type: String, default: null })
  notes!: string;

  @Prop({
  type: String,
  required: false,
})
couponCode?: string;

@Prop({
  type: Number,
  default: 0,
})
discountPercent!: number;
}

export const bookingSchema = SchemaFactory.createForClass(Booking);

bookingSchema.virtual('serviceDetails', {
  localField:   '_id',
  ref:          'Service',
  foreignField: 'bookingId',
});

bookingSchema.set('toObject', { virtuals: true });
bookingSchema.set('toJSON',   { virtuals: true });

export type HBookingDocument = HydratedDocument<Booking>;

export const BookingModel = MongooseModule.forFeature([
  { name: Booking.name, schema: bookingSchema },
]);