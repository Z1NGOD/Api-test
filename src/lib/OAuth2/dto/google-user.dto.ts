import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class GoogleUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    photo: string;
    @IsOptional()
    @IsStrongPassword()
    @IsString()
    password: string;
}
