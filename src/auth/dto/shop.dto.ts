import { IsNumber, IsString } from 'class-validator';

export class ShopDto {

    @IsNumber()
    scPrice: number;

    @IsNumber()
    realPrice: number;

    @IsString()
    scImage: string;
}