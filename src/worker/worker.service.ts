// src/worker/worker.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Worker, HWorkerDocument } from '../DB/worker.model';
import { Booking, HBookingDocument } from '../DB/booking.model';
import { Service, HServiceDocument } from '../DB/service.model';

import { AddworkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';

import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { BookingStatus } from '../common/Types/types';

// Valid status transitions — worker can only move forward
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  [BookingStatus.ASSIGNED]:   [BookingStatus.ACCEPTED, BookingStatus.REJECTED],
  [BookingStatus.ACCEPTED]:   [BookingStatus.ON_THE_WAY],
  [BookingStatus.ON_THE_WAY]: [BookingStatus.COMPLETED],
};

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(Worker.name)  
    private readonly WorkerModel:  Model<HWorkerDocument>,
    @InjectModel(Booking.name) 
    private readonly BookingModel: Model<HBookingDocument>,
    @InjectModel(Service.name) 
    private readonly ServiceModel: Model<HServiceDocument>,
    private readonly jwtService: JwtService,
  ) {}

  // ─── ADMIN: ADD WORKER ──────────────────────────────────────
  async addWorker(createWorkerDto: AddworkerDto) {
    const existing = await this.WorkerModel.findOne({
      nationalId: createWorkerDto.nationalId,
    });
    if (existing) {
      throw new BadRequestException(
        'A worker with this national ID already exists',
      );
    }

   

    const worker = await this.WorkerModel.create({
      ...createWorkerDto
    });

    const {  ...workerObj } = worker.toObject();

    return { message: 'Worker created successfully', worker: workerObj };
  }

  // ─── ADMIN: GET ALL WORKERS ─────────────────────────────────
  async getAllWorkers() {
    return this.WorkerModel.find().select('-password');
  }

  // ─── ADMIN: GET ONE WORKER ──────────────────────────────────
  async getWorkerById(id: string) {
    const worker = await this.WorkerModel.findById(id).select('-password');
    if (!worker) throw new NotFoundException('Worker not found');
    return worker;
  }

  // ─── ADMIN: UPDATE WORKER ───────────────────────────────────
  async updateWorker(id: string, updateWorkerDto: UpdateWorkerDto) {
    const worker = await this.WorkerModel.findById(id);
    if (!worker) throw new NotFoundException('Worker not found');

    const { fullName, phone, nationalId, isAvailable, documents } = updateWorkerDto;

    if (fullName)              worker.fullName   = fullName;
    if (phone)                 worker.phone      = phone;
    if (nationalId)            worker.nationalId = nationalId;
    if (isAvailable !== undefined) worker.isAvailable = isAvailable;
    if (documents)             worker.documents  = documents;

    await worker.save();

    const { ...workerObj } = worker.toObject();

    return { message: 'Worker updated successfully', worker: workerObj };
  }

  // ─── ADMIN: DELETE WORKER ───────────────────────────────────
  async DeleteAccount(id: string) {
    const worker = await this.WorkerModel.findById(id);
    if (!worker) throw new NotFoundException('Worker not found');
    await this.WorkerModel.findByIdAndDelete(id);
    return { message: 'Worker deleted successfully' };
  }


  
 
}