// src/worker/dto/update-availability.dto.ts

import { IsBoolean } from 'class-validator';

export class UpdateAvailabilityDto {
  @IsBoolean()
  isAvailable!: boolean;
}