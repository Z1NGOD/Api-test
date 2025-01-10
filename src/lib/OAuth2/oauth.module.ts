import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OAuth2Config } from "./config/google-oauth.config";
import { GoogleOAuthStrategy } from "./srategies/google-oauth.strategy";
import { OAuth2Service } from "./services/oauth2.service";
import { DbModule } from "@lib/db";
import { CloudinaryModule } from "@lib/cloudinary";
import { MailModule } from "@lib/mail";

@Module({
    imports: [ConfigModule.forFeature(OAuth2Config), DbModule, CloudinaryModule, MailModule],
    providers: [GoogleOAuthStrategy, OAuth2Service],
    exports: [GoogleOAuthStrategy],
})
export class OAuthModule {}
