import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({
        description: "Email address of the user",
        example: "user@example.com",
        type: String,
    })
    @IsEmail()
    email: string;
}
