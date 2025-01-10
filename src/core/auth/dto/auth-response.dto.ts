import { Expose, Type } from "class-transformer";
import { UserDto } from "@core/user/dto";

export class AuthResponseDto {
    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @Expose()
    accessToken: string;

    @Expose()
    refreshToken: string;
}
