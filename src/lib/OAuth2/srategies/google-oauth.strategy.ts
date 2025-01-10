import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { OAuth2Config } from "../config/google-oauth.config";
import { ConfigType } from "@nestjs/config";
import { OAuth2Service } from "../services/oauth2.service";
import { Profile } from "passport";

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(OAuth2Config.KEY)
        private readonly googleConfig: ConfigType<typeof OAuth2Config>,
        private readonly oauth2Service: OAuth2Service,
    ) {
        super({
            clientID: googleConfig.clientId,
            clientSecret: googleConfig.clientSecret,
            callbackURL: googleConfig.callbackUrl,
            scope: ["profile", "email"],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
        const user = await this.oauth2Service.validateGoogleUser({
            email: profile.emails[0].value,
            name: profile.name.givenName,
            photo: profile.photos[0].value,
            password: "",
        });
        done(null, user);
    }
}
