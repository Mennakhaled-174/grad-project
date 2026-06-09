import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto, LoginDto } from "./dto/create-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("request-otp")
  requestOtp(@Body() body: { email: string }) {
    return this.authService.requestOtp(body);
  }

  @Post("verify-reset-otp")
  verifyResetOtp(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyResetOtp(body);
  }

  @Post("reset-password")
  resetPassword(
    @Body()
    body: {
      resetToken: string;
      newPassword: string;
      confirmNewPassword: string;
    },
  ) {
    return this.authService.resetPassword(body);
  }
}