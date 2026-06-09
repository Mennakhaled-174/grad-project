
import { IsOptional, IsString, IsDateString, IsEnum, IsEmail } from "class-validator";



export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullname!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}