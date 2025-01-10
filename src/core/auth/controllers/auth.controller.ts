import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { Controller, UseInterceptors, Post, Body, HttpStatus } from "@nestjs/common";
import { AuthService } from "../services";
import { AuthResponseDto, LoginDto } from "../dto";
import { Serialize } from "@common/decorators";
import { ResponseInterceptor } from "@common/interceptors/response.interceptor";
import { RefreshTokenDto } from "../dto/refresh-token.dto";

@ApiTags("Auth")
@Controller("auth")
@UseInterceptors(ResponseInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @Serialize(AuthResponseDto)
    @ApiOperation({ summary: "User login" })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "User has been successfully logged in.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post("refresh")
    @ApiOperation({ summary: "Refresh access token" })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Access token and refresh token has been successfully refreshed.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    refreshToken(@Body() user: RefreshTokenDto) {
        return this.authService.updateAccessToken(user.refreshToken, {
            id: user.id,
            email: user.email,
        });
    }
}
