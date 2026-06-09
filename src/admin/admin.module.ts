import { Module } from '@nestjs/common';

import { AdminService } from './admin.service';


import { UserModel } from '../DB/user.model';
import { BookingModel } from '../DB/booking.model';
import { WorkerModel } from '../DB/worker.model';

import { JwtService } from '@nestjs/jwt';

import { RolesGuard } from '../common/Guard/role.guard';
import { AuthGuard } from '../common/Guard/auth.guard';

import { BookingsAdminController } from './booking.admin.controller';
import { UsersAdminController } from './user.admin.controller';
import{ WorkersAdminController } from '../admin/admin.controller'

@Module({
  imports: [
    UserModel,
    BookingModel,
    WorkerModel,
  ],

  controllers: [
    BookingsAdminController,
    UsersAdminController,
    WorkersAdminController,
  ],

  providers: [
    AdminService,
    JwtService,
    RolesGuard,
    AuthGuard,
  ],
})
export class AdminModule {}