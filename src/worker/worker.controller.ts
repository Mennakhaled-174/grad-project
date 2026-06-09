// src/worker/worker.controller.ts

import {
  Controller, Get, Post, Body,
  Patch, Param, Delete, UseGuards, Req,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { AddworkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { RolesGuard } from '../common/Guard/role.guard';
import { Roles } from '../common/Decorators/roles.decorater';
import { AuthGuard } from '../common/Guard/auth.guard';
import { WorkerAuthGuard } from '../common/Guard/worker-auth.guard';
import { userRole } from '../common/Types/types';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  


  // ─── ADMIN ROUTES ───────────────────────────────────────────

  @Roles(userRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/add')
  addWorker(@Body() dto: AddworkerDto) {
    return this.workerService.addWorker(dto);
  }

  @Roles(userRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/')
  getAllWorkers() {
    return this.workerService.getAllWorkers();
  }

  @Roles(userRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/:id')
  getWorkerById(@Param('id') id: string) {
    return this.workerService.getWorkerById(id);
  }

  @Roles(userRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('/update/:id')
  updateWorker(@Param('id') id: string, @Body() dto: UpdateWorkerDto) {
    return this.workerService.updateWorker(id, dto);
  }

  @Roles(userRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/delete/:id')
  deleteWorker(@Param('id') id: string) {
    return this.workerService.DeleteAccount(id);
  }

}
  