import { IsString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';  // Import Types from mongoose

export class UpdateQuizzDto {
  @IsOptional()
  @IsString()
  quizzType?: string;

  @IsOptional()
  @IsString()
  quizzQuestion?: string;

  @IsOptional()
  @IsString()
  reponseCorrecte?: string;

  // If you're using `ObjectId`, use Types.ObjectId
  @IsOptional()
  categoryName?: Types.ObjectId | string;  // Now it can accept either a string or ObjectId

  @IsOptional()
  images?: string[];
}
