import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';

import { BookingService }
  from './booking.service';

import { CreateBookingDto }
  from './dto/create-booking.dto';

import { AuthGuard }
  from '../common/Guard/auth.guard';

@Controller('booking')

export class BookingController {

  constructor(

    private readonly bookingService:
      BookingService,
  ) {}

  // =========================
  // CREATE BOOKING
  // =========================

  @UseGuards(AuthGuard)

  @Post('/create')

  create(

    @Body()
    createBookingDto:
      CreateBookingDto,

    @Req()
    req: any,
  ) {

    return this.bookingService.create(

      req.user._id,

      createBookingDto,
    );
  }

  // =========================
  // PAYMENT SUCCESS
  // =========================

  @Get(
    '/payment-success/:bookingId',
  )

  paymentSuccess(

    @Param('bookingId')
    bookingId: string,
  ) {

    return this.bookingService
      .paymentSuccess(
        bookingId,
      );
  }

  // =========================
  // DELETE BOOKING
  // =========================

  @UseGuards(AuthGuard)

  @Delete('/delete/:bookingId')

  DeleteBooking(

    @Param('bookingId')
    bookingId: string,
  ) {

    return this.bookingService
      .cancelOrder(
        bookingId,
      );
  }

  // =========================
  // GET USER BOOKINGS
  // =========================

  @UseGuards(AuthGuard)

  @Get('/my-orders')

  getMyOrders(

    @Req()
    req: any,
  ) {

    return this.bookingService
      .getUserBookings(
        req.user._id,
      );
  }


}