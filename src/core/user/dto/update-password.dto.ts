import { IsString, MinLength, ValidateIf } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    @MinLength(8, { message: "Old password must be at least 8 characters long" })
    oldPassword: string;

    @IsString()
    @MinLength(8, { message: "New password must be at least 8 characters long" })
    newPassword: string;

    @IsString()
    @MinLength(8, {
        message: "Confirm password must be at least 8 characters long",
    })
    @ValidateIf(o => o.newPassword)
    confirmPassword: string;
}
