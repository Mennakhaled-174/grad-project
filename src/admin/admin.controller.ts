import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';

import { AuthGuard } from '../common/Guard/auth.guard';
import { RolesGuard } from '../common/Guard/role.guard';

import { Roles } from '../common/Decorators/roles.decorater';

import { userRole } from '../common/Types/types';

import { UpdateWorkerDto } from '../worker/dto/update-worker.dto';

@Controller('admin/workers')

@UseGuards(AuthGuard, RolesGuard)

@Roles(userRole.ADMIN)

export class WorkersAdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get()
  getAllWorkers() {
    return this.adminService.getAllWorkers();
  }

  @Get(':id')
  getWorkerById(
    @Param('id') id: string,
  ) {
    return this.adminService.getWorkerById(id);
  }

  @Patch(':id')
  updateWorker(
    @Param('id') id: string,

    @Body()
    updateWorkerDto: UpdateWorkerDto,
  ) {
    return this.adminService.updateWorker(
      id,
      updateWorkerDto,
    );
  }

  @Delete(':id')
  deleteWorker(
    @Param('id') id: string,
  ) {
    return this.adminService.deleteWorker(id);
  }
}