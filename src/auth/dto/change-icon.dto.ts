import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class ChangeIconDto {

    @IsOptional()
    @IsString()
    newIcon: string;

}