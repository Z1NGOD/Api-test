import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Refresh token",
        example: "123e4567-e89b-12d3-a456-426655440000",
    })
    refreshToken: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "User ID", example: "6754a85ce44cfd7e0606c9b7" })
    id: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: "User email", example: "user@example.com" })
    email: string;
}
