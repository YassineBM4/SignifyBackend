import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddCategoryDto {

    @IsNotEmpty()
    @IsString()
    readonly catName: String;

    @IsNotEmpty()
    @IsString()
    readonly catIcon: string;

    @IsNotEmpty()
    @IsString()
    readonly catDescription: string;

    @IsOptional()
    @IsNumber()
    readonly catPrice?: number;

    @IsOptional()
    @IsBoolean()
    readonly isLocked?: boolean;
}