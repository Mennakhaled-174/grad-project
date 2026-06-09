// src/common/Guard/worker-auth.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Worker, HWorkerDocument } from '../../DB/worker.model';

@Injectable()
export class WorkerAuthGuard implements CanActivate {
  constructor(
    @InjectModel(Worker.name) 
    private workerModel: Model<HWorkerDocument>,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Extract token from header
    const token = request?.headers?.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token is required');

    // 2. Verify token using same secret
    const payload = await this.jwtService.verify(token, {
      secret: process.env.TOKEN_ACCESS_ADMIN_SECRET,
    });

    // 3. Make sure it's a worker token
    if (payload.role !== 'worker') {
      throw new UnauthorizedException('Access denied: workers only');
    }

    // 4. Find the worker in DB
    const worker = await this.workerModel.findById(payload.id);
    if (!worker) throw new UnauthorizedException('Worker not found');

    // 5. Attach worker to request (same pattern as your AuthGuard)
    request.user = worker;

    return true;
  }
}