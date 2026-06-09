import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HUserDocument, User } from "../../DB/user.model";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<HUserDocument>,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    let request;

    if (context.getType() === "http") {
      request = context.switchToHttp().getRequest();
    } 

    const token = request?.headers?.authorization?.split(" ")[1];

    if (!token) throw new UnauthorizedException("Token is required");

    const payload = await this.jwtService.verify(token, {
      secret: process.env.TOKEN_ACCESS_ADMIN_SECRET,
    });

    const user = await this.userModel.findById(payload.id);
    if (!user) throw new BadRequestException("User not found");

    request.user = user;

    return true;
  }
}