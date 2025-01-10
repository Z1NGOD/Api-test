import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService, private readonly config: ConfigService) {}

    async createAccessToken<T>(payload: { sub: T }): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            expiresIn: this.config.get<string>("ACCESS_EXPIRE_TIME"),
            secret: this.config.get<string>("ACCESS_SECRET"),
        });
    }

    async createRefreshToken<T>(payload: { sub: T }): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            expiresIn: this.config.get<string>("REFRESH_EXPIRE_TIME"),
            secret: this.config.get<string>("REFRESH_SECRET"),
        });
    }

    verifyAccessToken(token: string): object {
        return this.jwtService.verify(token, {
            secret: this.config.get<string>("ACCESS_SECRET"),
        });
    }

    verifyRefreshToken(token: string): object {
        return this.jwtService.verify(token, {
            secret: this.config.get<string>("REFRESH_SECRET"),
        });
    }
}
