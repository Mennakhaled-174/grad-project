import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../common/Guard/auth.guard';
// import { AuthGuard } from 'src/common/Guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  

   @UseGuards(AuthGuard)
  @Patch("/update-account")
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const userId = req.user._id;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @UseGuards(AuthGuard)
@Delete("/delete")
DeleteAccount(@Req() req: any) {
  return this.userService.DeleteAccount(req.user._id);
}

@UseGuards(AuthGuard)
@Post("/logout")
logout(@Req() req: any) {
  return this.userService.logout(req.user._id);
}
}
