import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Roles } from "@common/enums";
import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: "The name of the user",
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: "The email of the user",
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: "The password for the user",
        type: String,
    })
    @IsOptional()
    @IsString()
    password: string;

    @ApiPropertyOptional({
        description: "The mobile number of the user",
        type: String,
    })
    @IsOptional()
    @IsString()
    mobile?: string;

    @ApiPropertyOptional({
        description: "The role of the user",
        enum: Roles,
        default: Roles.User,
    })
    @Optional()
    role: Roles;

    @ApiProperty({
        description: "The avatar of the user",
        example: ["https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"],
        required: false,
    })
    @IsOptional()
    @IsString()
    avatar: string;

    @ApiPropertyOptional({
        description: "The reset password token if the user is resetting their password",
        type: String,
    })
    @Optional()
    resetPasswordToken: string;

    @ApiPropertyOptional({
        description: "The expiration date for the reset password token",
        type: Date,
    })
    @Optional()
    resetPasswordExpires: Date;
}
