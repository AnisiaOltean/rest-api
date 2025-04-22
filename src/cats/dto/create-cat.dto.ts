import { IsString, IsNumber, IsBoolean } from "class-validator";

export class CreateCatDto {
    @IsString()
    name: string;

    @IsString()
    breed: string;

    @IsNumber()
    ownerId: number;

    @IsBoolean()
    isFed: boolean;
}
