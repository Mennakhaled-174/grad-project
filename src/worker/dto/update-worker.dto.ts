import { IsString, IsBoolean, IsOptional, IsEnum, Length } from 'class-validator';
import { documentEnum } from '../../common/Types/types';

export class UpdateWorkerDto {

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @Length(14, 14)
  nationalId?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsEnum(documentEnum)
  @IsOptional()
  documents?: string;
}