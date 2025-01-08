import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ChangeLockDto {
  @IsString()
  @IsOptional()
  categoryId: string;

  @IsBoolean()
  isLockedStatus: boolean;
}
