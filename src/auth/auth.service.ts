import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User } from '../DB/user.model';
import { Model, Types } from 'mongoose';
import { HOtpDocument, Otp } from '../DB/otp.model';
import { generate } from 'rxjs';
import { generateOTP } from '../Utiles/otp.util';
import { otpEnum } from '../common/Types/types';
import { compareHash, Hash } from '../common/Security/hash.security';
import { emailEvents } from '../Utiles/Events/email.event';
import { JwtService } from '@nestjs/jwt';
import { generateTokens } from '../Utiles/Token/token';
import { randomUUID } from 'crypto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<HUserDocument>,
    @InjectModel(Otp.name) private otpModel: Model<HOtpDocument>,
    private jwtService: JwtService,
  ) { }



  async createOtp(userId: Types.ObjectId) {
    await this.otpModel.create({
      userId,
      otp: generateOTP(),
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
      otpType: otpEnum.changePassword
    })
  }


  async signup(createAuthDto: SignUpDto) {
    const checkUser = await this.userModel.findOne({ email: createAuthDto.email })
    if (checkUser) {
      throw new BadRequestException("email already exists")
    }
    const user = await this.userModel.create(createAuthDto)
    user.updatedBy = user._id
    await user.save()

    await this.createOtp(user._id)
    return user
  }


  async login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  const user = await this.userModel.findOne({
    email,
    isDeleted: false,
  });

  if (!user) {
    console.log("User not found");
    throw new NotFoundException("user not found");
  }

  console.log("User Found");
  console.log("Stored Password:", user.password);

  const isMatch = await compareHash(password, user.password);

  console.log("Password Match:", isMatch);

  if (!isMatch) {
    console.log("Password comparison failed");
    throw new NotFoundException("invalid email or password");
  }

  console.log("Login Success");

  const jwtid = randomUUID();

  const tokens = await generateTokens(
    this.jwtService,
    {
      id: user._id,
      email: user.email,
    },
    process.env.TOKEN_ACCESS_ADMIN_SECRET!,
    process.env.TOKEN_REFRESH_ADMIN_SECRET!,
    Number(process.env.ACCESS_TOKEN_EXPIRE_IN),
    Number(process.env.REFRESH_TOKEN_EXPIRE_IN),
  );

  return {
    user,
    tokens,
  };
}
//-------------------------------------------------------------------

  // async login(loginDto: LoginDto) {
  //   const { email, password } = loginDto

  //   const user = await this.userModel.findOne({
  //     email,
  //     isDeleted: false
  //   })
  //   if (!user) throw new NotFoundException("user not found")


  //   console.log("Entered Password:", password);
  //   console.log("Stored Password:", user.password);

  //   if (!(await compareHash(password, user.password)))
  //     throw new NotFoundException("invalid email or password")
  //   const jwtid = randomUUID();

  //   const tokens = await generateTokens(
  //     this.jwtService,
  //     { id: user._id, email: user.email },
  //     process.env.TOKEN_ACCESS_ADMIN_SECRET!,
  //     process.env.TOKEN_REFRESH_ADMIN_SECRET!,
  //     Number(process.env.ACCESS_TOKEN_EXPIRE_IN),
  //     Number(process.env.REFRESH_TOKEN_EXPIRE_IN),
  //   );
  //   return { user, tokens }
  // }

 async requestOtp(body: { email: string }) {
    const user = await this.userModel.findOne({ email: body.email });

    if (!user) throw new NotFoundException("User not found");

    await this.otpModel.deleteMany({
      userId: user._id,
      otpType: otpEnum.changePassword,
    });

const otpCode = generateOTP();

await this.otpModel.create({
  userId: user._id,
  otp: otpCode, 
  otpType: otpEnum.changePassword,
  expireAt: new Date(Date.now() + 10 * 60 * 1000),
  isUsed: false,
});

    emailEvents.emit("changePassword", {
      to: body.email,
      otp: otpCode,
      firstName: user.fullname.split(" ")[0],
    });

    return { message: "OTP sent successfully" };
  }

  // ---------------------------
  // VERIFY OTP → RETURN RESET TOKEN
  // ---------------------------
  async verifyResetOtp(body: { email: string; otp: string }) {
    const user = await this.userModel.findOne({ email: body.email });

    if (!user) throw new NotFoundException("User not found");

    const otpRecord = await this.otpModel.findOne({
      userId: user._id,
      otpType: otpEnum.changePassword,
      expireAt: { $gt: new Date() },
      isUsed: false,
    });

    if (!otpRecord)
      throw new BadRequestException("Invalid or expired OTP");

    const valid = await compareHash(body.otp, otpRecord.otp);

    if (!valid) throw new BadRequestException("Invalid OTP");

    otpRecord.isUsed = true;
    await otpRecord.save();

    const resetToken = randomUUID();

    user.resetToken = resetToken;
    user.resetTokenExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    return {
      message: "OTP verified successfully",
      resetToken,
    };
  }

  // ---------------------------
  // RESET PASSWORD
  // ---------------------------
  async resetPassword(body: {
    resetToken: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    const { resetToken, newPassword, confirmNewPassword } = body;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const user = await this.userModel.findOne({
      resetToken,
      resetTokenExpire: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    user.password = newPassword;

    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    await this.otpModel.deleteMany({
      userId: user._id,
      otpType: otpEnum.changePassword,
    });

    return { message: "Password updated successfully" };
  }

  
}
