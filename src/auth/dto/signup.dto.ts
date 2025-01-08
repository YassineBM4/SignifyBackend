import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDto {

    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter the correct email form." })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

    @IsOptional()
    @IsNumber()
    readonly gems?: number;

    @IsOptional()
    @IsNumber()
    readonly level?: number;

    @IsOptional()
    @IsNumber()
    readonly levelProgress?: number;

    @IsOptional()
    @IsString()
    readonly icon: string;

}