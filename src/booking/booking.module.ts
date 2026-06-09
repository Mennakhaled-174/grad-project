import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { UserModel } from '../DB/user.model';
import { BookingModel } from '../DB/booking.model';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../common/Guard/auth.guard';
import { WorkerModel } from '../DB/worker.model';
import { ServiceModel } from '../DB/service.model';
// import { StripeService } from './stripe.service';
import { CouponModule } from '../coupon/coupon.module';
import { BookingCronService } from '../Crons/booking.crons';


@Module({
  imports: [UserModel, BookingModel, WorkerModel, ServiceModel,CouponModule],
  controllers: [BookingController],
  providers: [BookingService, JwtService, AuthGuard ,BookingCronService],
})
export class BookingModule { }
