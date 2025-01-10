import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: "Email address of the user",
        example: "user@example.com",
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Password of the user",
        example: "securePassword123",
    })
    password: string;
}
