// src/worker/worker.module.ts

import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { WorkerModel } from '../DB/worker.model';
import { BookingModel } from '../DB/booking.model';
import { ServiceModel } from '../DB/service.model';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '../common/Guard/role.guard';
import { AuthGuard } from '../common/Guard/auth.guard';
import { WorkerAuthGuard } from '../common/Guard/worker-auth.guard';
import { UserModel } from '../DB/user.model';

@Module({
  imports: [WorkerModel, BookingModel, ServiceModel, UserModel],
  controllers: [WorkerController],
  providers: [
    WorkerService,
    JwtService,
    RolesGuard,
    AuthGuard,
    WorkerAuthGuard,
  ],
})
export class WorkerModule {}