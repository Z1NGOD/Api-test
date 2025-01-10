import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class Payer {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;
    @IsNotEmpty()
    @IsString()
    description: string;
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Payer)
    payer: Payer;
}
