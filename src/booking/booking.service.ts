import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { CreateBookingDto } from './dto/create-booking.dto';

import { servicesPrices } from '../common/constents/prices';

import { Booking, HBookingDocument } from '../DB/booking.model';

import { Service, HServiceDocument } from '../DB/service.model';

import { User, HUserDocument } from '../DB/user.model';

import { Worker, WorkerDocument } from '../DB/worker.model';

import { bookingEvents } from '../Utiles/Events/booking.event';

import { paymentMethodEnum } from '../common/Types/types';

import { CouponService } from '../coupon/coupon.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<HBookingDocument>,

    @InjectModel(Service.name)
    private serviceModel: Model<HServiceDocument>,

    @InjectModel(User.name)
    private userModel: Model<HUserDocument>,

    @InjectModel(Worker.name)
    private workerModel: Model<WorkerDocument>,

    private readonly couponService: CouponService,
  ) {}

  async create(userId: Types.ObjectId, createBookingDto: CreateBookingDto) {
    const { service, size, paymentMethod, couponCode } = createBookingDto;

   
    // DATE VALIDATION
 
    const bookingDate = new Date(createBookingDto.date);
    const now = new Date();

    const diffInMs   = bookingDate.getTime() - now.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 0) {
      throw new BadRequestException('You cannot book in the past');
    }

    if (diffInDays > 14) {
      throw new BadRequestException('You can only book within the next 14 days');
    }

   
    // PRICE
    const originalPrice = servicesPrices[service]?.[size];

    if (!originalPrice) {
      throw new BadRequestException('Invalid service or size');
    }

    let finalPrice     = originalPrice;
    let discountPercent = 0;

    if (couponCode) {
  const couponResult = await this.couponService.validateAndApply(
    couponCode,
    originalPrice,
    userId,        // ← add this
  );
  finalPrice      = couponResult.finalPrice;
  discountPercent = couponResult.discountPercent;
}

   
    // AVAILABLE WORKER
    const worker = await this.workerModel.findOne({ isAvailable: true });

    if (!worker) {
      throw new BadRequestException('No available workers at this time');
    }

    // =========================
    // CREATE BOOKING
    // =========================
    const booking = await this.bookingModel.create({
      fullname:       createBookingDto.fullname,
      phone:          createBookingDto.phone,
      city:           createBookingDto.city,
      addressDetails: createBookingDto.addressDetails,
      building:       createBookingDto.building,
      floor:          createBookingDto.floor,
      apartment:      createBookingDto.apartment,
      date:           createBookingDto.date,
      time:           createBookingDto.time,
      paymentMethod,
      paymentStatus:  'pending',
      userId,
      workerId:       worker._id,
      totalPrice:     finalPrice,
    });

    // =========================
    // MAKE WORKER UNAVAILABLE
    // =========================
    await this.workerModel.findByIdAndUpdate(worker._id, {
      isAvailable: false,
    });

    // =========================
    // CREATE SERVICE
    // =========================
    const serviceData = await this.serviceModel.create({
      service,
      size,
      price:     finalPrice,
      bookingId: booking._id,
    });

    // =========================
    // GET USER
    // =========================
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // =========================
    // CASH — send email directly
    // =========================
    if (paymentMethod === paymentMethodEnum.CASH) {
      bookingEvents.emit('sendBookingDetails', {
        to:             user.email,
        fullname:       booking.fullname,
        phone:          booking.phone,
        city:           booking.city,
        addressDetails: booking.addressDetails,
        building:       booking.building,
        floor:          booking.floor,
        apartment:      booking.apartment,
        date:           booking.date,
        time:           booking.time,
        service:        serviceData.service,
        size:           serviceData.size,
        price:          serviceData.price,
        paymentMethod:  booking.paymentMethod,
        paymentStatus:  booking.paymentStatus,
        totalPrice:     finalPrice,
        couponCode,
        discountPercent,
        worker: {
          fullName:   worker.fullName,
          phone:      worker.phone,
          nationalId: worker.nationalId,
          documents:  worker.documents,
        },
      });

      return {
        message: 'Booking created successfully',
        booking,
        service: serviceData,
        worker,
      };
    }

    // =========================
    // CREDIT — simulation (no Stripe)
    // =========================
    if (paymentMethod === paymentMethodEnum.CREDIT) {
      return {
        message: 'Booking created successfully',
        booking,
        service: serviceData,
        worker,
      };
    }

    return {
      message: 'Booking created successfully',
      booking,
    };
  }

  // =========================
  // PAYMENT SUCCESS
  // =========================
  async paymentSuccess(bookingId: string) {
    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    booking.paymentStatus = 'paid';
    await booking.save();

    const user    = await this.userModel.findById(booking.userId);
    const service = await this.serviceModel.findOne({ bookingId: booking._id });
    const worker  = await this.workerModel.findById(booking.workerId);

    bookingEvents.emit('sendBookingDetails', {
      to:             user?.email,
      fullname:       booking.fullname,
      phone:          booking.phone,
      city:           booking.city,
      addressDetails: booking.addressDetails,
      building:       booking.building,
      floor:          booking.floor,
      apartment:      booking.apartment,
      date:           booking.date,
      time:           booking.time,
      service:        service?.service,
      size:           service?.size,
      price:          service?.price,
      paymentMethod:  booking.paymentMethod,
      paymentStatus:  booking.paymentStatus,
      worker: {
        fullName:   worker?.fullName,
        phone:      worker?.phone,
        nationalId: worker?.nationalId,
        documents:  worker?.documents,
      },
    });

    return { message: 'Payment successful & email sent' };
  }

  // =========================
  // CANCEL ORDER
  // =========================
  async cancelOrder(bookingId: string) {
    if (!Types.ObjectId.isValid(bookingId)) {
      throw new BadRequestException('Invalid booking id');
    }

    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    await this.bookingModel.findByIdAndDelete(bookingId);

    return { message: 'Booking deleted successfully' };
  }

  // =========================
  // GET USER BOOKINGS
  // =========================
  async getUserBookings(userId: Types.ObjectId) {
    const bookings = await this.bookingModel
      .find({ userId })
      .populate('serviceDetails')
      .populate('workerId')
      .sort({ createdAt: -1 });

    return {
      message:  'User bookings fetched successfully',
      results:  bookings.length,
      bookings,
    };
  }
}