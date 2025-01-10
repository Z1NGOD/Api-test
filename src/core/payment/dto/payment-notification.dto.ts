import { IsString, IsEmail, IsOptional } from "class-validator";

export class PaymentNotificationDto {
    @IsString()
    id: string;

    @IsString()
    tr_id: string;

    @IsString()
    tr_date: string;

    @IsString()
    @IsOptional() // Optional if the field can be empty
    tr_crc: string;

    @IsString()
    tr_amount: string;

    @IsString()
    tr_paid: string;

    @IsString()
    tr_desc: string;

    @IsString()
    tr_status: string;

    @IsString()
    tr_error: string;

    @IsEmail()
    tr_email: string;

    @IsString()
    test_mode: string;

    @IsString()
    md5sum: string;
}
