import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { AdminModule } from './admin/admin.module';
import { WorkerModule } from './worker/worker.module';
import { CouponModule } from './coupon/coupon.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), 'config/.env.dev'),
    }),

    MongooseModule.forRoot(process.env.DB_URI as string, {
      serverSelectionTimeoutMS: 5000,
      onConnectionCreate(connection) {
        connection.on('connected', () => {
          console.log('MongoDB Connected Successfully');
        });
      },
    }),
    UserModule,
    AuthModule,
    BookingModule,
    AdminModule,
    WorkerModule,
    CouponModule,

    // ApplicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
