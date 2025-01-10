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

    @Serialize(AuthResponseDto)
    @Post("registration")
    @ApiOperation({ summary: "Register a new user" })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "User has been successfully registered.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }

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

    @Post("forgot-password")
    @ApiOperation({ summary: "Forgot password request" })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Password reset link has been sent to the email.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Post("reset-password")
    @ApiOperation({ summary: "Reset password" })
    @ApiQuery({
        name: "token",
        type: String,
        description: "Password reset token from the email link",
    })
    @ApiBody({ type: String })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Password has been successfully reset.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    resetPassword(@Query("token") resetToken: string, @Body("password") password: string) {
        return this.authService.resetPassword(resetToken, password);
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
