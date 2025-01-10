import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RequestUser {
    @IsNotEmpty()
    @IsString()
    id: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
