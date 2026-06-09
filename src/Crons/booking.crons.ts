import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, HBookingDocument } from '../DB/booking.model';
import { paymentMethodEnum } from '../common/Types/types';

@Injectable()
export class BookingCronService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<HBookingDocument>,
  ) {}

  @Cron('0 * * * *') // كل ساعة
  async updateCashBookings() {
    const now = new Date();

    const bookings = await this.bookingModel.find({
      paymentMethod: paymentMethodEnum.CASH,
      paymentStatus: 'pending',
      date: { $lt: now },
    });

    for (const booking of bookings) {
      booking.paymentStatus = 'paid';
      await booking.save();
    }
  }
}