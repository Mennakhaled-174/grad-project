import { IsOptional, IsString, IsEmail, IsNotEmpty } from "class-validator";


export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullname!: string;

  
    @IsEmail()
    @IsNotEmpty()
    email!: string
  

  }