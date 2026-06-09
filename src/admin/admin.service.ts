import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../DB/user.model';
import { Booking } from '../DB/booking.model';
import { Worker } from '../DB/worker.model';


import { UpdateWorkerDto } from '../worker/dto/update-worker.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Booking.name)
    private bookingModel: Model<Booking>,

    @InjectModel(Worker.name)
    private workerModel: Model<Worker>,
  ) {}

  // ================= DASHBOARD STATS =================

  async getStats() {
    const usersCount = await this.userModel.countDocuments();

    const bookingsCount =
      await this.bookingModel.countDocuments();

    const paidBookings =
      await this.bookingModel.countDocuments({
        paymentStatus: 'paid',
      });

    const workersCount =
      await this.workerModel.countDocuments();

    return {
      usersCount,
      bookingsCount,
      paidBookings,
      workersCount,
    };
  }

  // ================= RECENT BOOKINGS =================

  async getRecentBookings() {
    return this.bookingModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId');
  }

  // ================= WORKERS =================

  async getAllWorkers() {
    return this.workerModel.find();
  }

  async getWorkerById(id: string) {
    const worker = await this.workerModel.findById(id);

    if (!worker) {
      throw new NotFoundException(
        'worker not found',
      );
    }

    return worker;
  }

  async updateWorker(
    id: string,
    updateWorkerDto: UpdateWorkerDto,
  ) {
    const worker =
      await this.workerModel.findById(id);

    if (!worker) {
      throw new NotFoundException(
        'worker not found',
      );
    }

    const {
      fullName,
      phone,
      nationalId,
      isAvailable,
      documents

    } = updateWorkerDto;

    if (fullName)
      worker.fullName = fullName;

    if (phone)
      worker.phone = phone;

    if (nationalId)
      worker.nationalId = nationalId;

    // IMPORTANT FIX
    if (isAvailable !== undefined) {
      worker.isAvailable = isAvailable;
    }
    
    if (documents) {
      worker.documents = documents;
    }

    await worker.save();

    return {
      message:
        'worker updated successfully',
      worker,
    };
  }

  async deleteWorker(id: string) {
    const worker =
      await this.workerModel.findById(id);

    if (!worker) {
      throw new NotFoundException(
        'worker not found',
      );
    }

    await this.workerModel.findByIdAndDelete(id);

    return {
      message:
        'worker deleted successfully',
    };
  }
}