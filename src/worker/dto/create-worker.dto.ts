import { IsString, IsNotEmpty, Length, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { documentEnum } from '../../common/Types/types';

export class AddworkerDto {

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @Length(14, 14, { message: 'National ID must be exactly 14 digits' })
  nationalId!: string;

  
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsEnum(documentEnum)
  @IsOptional()
  documents?: string;
}