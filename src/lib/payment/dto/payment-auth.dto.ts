import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PaymentAuthDto {
    @IsNotEmpty()
    @IsNumber()
    issued_at: string;
    @IsNotEmpty()
    @IsString()
    scope: string;
    @IsNotEmpty()
    @IsString()
    token_type: string;
    @IsNotEmpty()
    @IsNumber()
    expires_in: string;
    @IsNotEmpty()
    @IsString()
    client_id: string;
    @IsNotEmpty()
    @IsString()
    access_token: string;
}
