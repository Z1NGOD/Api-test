import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDto } from "../dto";
import { UserService } from "@core/user/services";
import { PasswordService, TokenService } from "@lib/security/services";
import { RequestUser } from "../interfaces";
import { Response } from "express";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly passwordService: PasswordService, private readonly tokenService: TokenService) {}

    async login(userDto: LoginDto) {
        if (!userDto) {
            throw new BadRequestException("No user data");
        }

        const user = await this.userService.findByEmail(userDto.email.toLowerCase());
        if (!user) {
            throw new BadRequestException("User not found");
        }

        const isPasswordCorrect = await this.passwordService.scryptVerify(userDto.password, user.password);
        if (!isPasswordCorrect) {
            throw new BadRequestException("Wrong password");
        }

        const payload = { sub: user._id, email: user.email };
        const tokens = await this.createTokens(payload);

        return { user, ...tokens };
    }

    async googleLogin(user, res: Response) {
        const payload = { sub: user._id, email: user.email };
        const tokens = await this.createTokens(payload);

        return res.redirect(`http://localhost:8000?token=${tokens.accessToken}`);
    }

    async updateAccessToken(refreshToken: string, user: RequestUser) {
        if (!refreshToken) {
            throw new BadRequestException("No refresh token");
        }
        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.tokenService.createAccessToken(payload);

        return { accessToken };
    }

    private async createTokens<T>(payload: { sub: T; email?: string }) {
        const accessToken = await this.tokenService.createAccessToken(payload);
        const refreshToken = await this.tokenService.createRefreshToken(payload);

        return { accessToken, refreshToken };
    }
}
