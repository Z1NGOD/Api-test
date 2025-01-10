import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from "@nestjs/swagger";
import { Controller, UseInterceptors, Post, Body, Query, HttpStatus, Get, UseGuards, Req, Res } from "@nestjs/common";
import { AuthService } from "../services";
import { AuthResponseDto, ForgotPasswordDto, LoginDto } from "../dto";
import { Serialize } from "@common/decorators";
import { CreateUserDto } from "@core/user/dto";
import { ResponseInterceptor } from "@common/interceptors/response.interceptor";
import { GoogleOauthGuardTsGuard } from "@lib/OAuth2/guards/google-oauth.guard";
import { Request, Response } from "express";
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

    @UseGuards(GoogleOauthGuardTsGuard)
    @Get("google/login")
    googleLogin() {
        return "Google Auth";
    }

    @UseGuards(GoogleOauthGuardTsGuard)
    @Get("google/callback")
    async googleCallback(@Req() req: Request, @Res() res: Response) {
        return await this.authService.googleLogin(req.user, res);
    }
}
