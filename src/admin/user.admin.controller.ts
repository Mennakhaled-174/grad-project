import { Controller, UseGuards, Get, Delete, Param } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Roles } from "../common/Decorators/roles.decorater";
import { AuthGuard } from "../common/Guard/auth.guard";
import { RolesGuard } from "../common/Guard/role.guard";
import { userRole } from "../common/Types/types";
import { User } from "../DB/user.model";

@Controller('admin/users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(userRole.ADMIN)
export class UsersAdminController {

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Get()
  getAllUsers() {
    return this.userModel.find().sort({ createdAt: -1 });
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}