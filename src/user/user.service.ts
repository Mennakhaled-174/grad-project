import { Injectable, NotFoundException ,ConflictException} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User } from '../DB/user.model';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<HUserDocument>) { }

  async updateUser(userId: Types.ObjectId, updateUserDto: UpdateUserDto) {
  const user = await this.userModel.findById(userId);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const { fullname, email } = updateUserDto;

  if (email) {
    const existingUser = await this.userModel.findOne({ email });

    if (
      existingUser &&
      existingUser._id.toString() !== userId.toString()
    ) {
      throw new ConflictException('Email already exists');
    }

    user.email = email;
  }

  if (fullname) {
    user.fullname = fullname;
  }

  await user.save();

  return {
    message: 'Account updated successfully',
    user,
  };
}

  async DeleteAccount(userId: Types.ObjectId) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.userModel.findByIdAndDelete(userId);



    return {
      message: "Account  deleted successfully",
    };
  }

  async logout(userId: Types.ObjectId) {

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.changeCredentialTime = new Date();

    await user.save();

    return {
      message: "Logged out successfully",
    };
  }
}



