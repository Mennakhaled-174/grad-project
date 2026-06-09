import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, HBookingDocument } from '../DB/booking.model';
import { AuthGuard } from '../common/Guard/auth.guard';
import { RolesGuard } from '../common/Guard/role.guard';
import { Roles } from '../common/Decorators/roles.decorater';
import { userRole } from '../common/Types/types';

@Controller('admin/bookings')
@UseGuards(AuthGuard, RolesGuard)
@Roles(userRole.ADMIN)
export class BookingsAdminController {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<HBookingDocument>,
  ) {}

  // =========================
  // GET ALL BOOKINGS
  // =========================
  @Get()
  async getAllBookings() {
    const bookings = await this.bookingModel
      .find()
      .sort({ createdAt: -1 })
      .populate('userId')
      .populate('workerId');

    return {
      message: 'All bookings fetched successfully',
      results: bookings.length,
      bookings,
    };
  }

  // =========================
  // GET ONE BOOKING
  // =========================
  @Get(':id')
  async getBooking(@Param('id') id: string) {
    const booking = await this.bookingModel
      .findById(id)
      .populate('userId')
      .populate('workerId');

    return {
      message: 'Booking fetched successfully',
      booking,
    };
  }

  // =========================
  // DELETE BOOKING (hard delete)
  // =========================
  @Delete(':id')
  async deleteBooking(@Param('id') id: string) {
    await this.bookingModel.findByIdAndDelete(id);

    return {
      message: 'Booking deleted successfully',
    };
  }
}