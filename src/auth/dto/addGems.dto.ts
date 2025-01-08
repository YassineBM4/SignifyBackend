import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class AddGemsDto {

  @IsInt()
  @IsPositive()
  earnedGems: number;

}