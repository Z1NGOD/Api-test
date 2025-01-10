import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { REFRESH_STRATEGY_NAME } from "@common/constants";

export interface JwtPayload {
    sub: string;
    email: string;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, REFRESH_STRATEGY_NAME) {
    constructor(private readonly config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
            ignoreExpiration: false,
            secretOrKey: config.get<string>("REFRESH_SECRET"),
            passReqToCallback: true,
        });
    }
    async validate(payload: JwtPayload) {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
