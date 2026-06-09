import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator'

export class SignUpDto {
    @IsString({ message: "name must be a string" })
    @IsNotEmpty()
    @MinLength(3, { message: "name must be at least 3 characters" })
    fullname!: string

    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsString()
    password!: string

    @IsNotEmpty()
    @IsString()
    nationalId!: string
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsString()
    password!: string
}