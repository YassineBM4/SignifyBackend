import { IsUUID, IsNotEmpty } from 'class-validator';

export class ChangeGemsDTO {
    @IsNotEmpty()
    categoryId: string;
}
