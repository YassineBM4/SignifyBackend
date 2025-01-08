import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class loginDto {

    @IsNotEmpty()
    @IsEmail({}, {message: "Please enter the correct email form."})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

}