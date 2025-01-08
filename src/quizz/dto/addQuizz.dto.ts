import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddQuizzDto {

    @IsNotEmpty()
    @IsString()
    readonly quizzType: String;

    @IsNotEmpty()
    @IsString()
    readonly quizzQuestion: string;

    @IsNotEmpty()
    @IsString()
    reponseCorrecte: string;

    @IsNotEmpty()
    @IsString()
    readonly categoryName: string;

}