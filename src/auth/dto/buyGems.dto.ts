import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class AwardGemsDto {

  @IsInt()
  @IsPositive()
  correctAnswersCount: number;

  @IsInt()
  @IsPositive()
  expEarned: number;

  @IsInt()
  @IsPositive()
  catProgress: number;

  @IsString()
  @IsOptional()
  categoryId: string;
}