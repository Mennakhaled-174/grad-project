import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserModel, userSchema } from '../DB/user.model';
import { AuthGuard } from '../common/Guard/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
   UserModel,
   
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard , JwtService],
})
export class UserModule {}
