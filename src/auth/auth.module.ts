import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel } from '../DB/user.model';
import { otpModel } from '../DB/otp.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModel, otpModel],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule { }
