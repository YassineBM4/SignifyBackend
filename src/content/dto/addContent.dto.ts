import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddContentDto {
    @IsString()
    contentName: string;
  
    @IsString()
    categoryName: string;
  
    contentImage: string;
  }
  