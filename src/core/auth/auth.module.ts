import { Module } from "@nestjs/common";
import { AuthController } from "./controllers";
import { AuthService } from "./services";
import { UserModule } from "../user";
import { SecurityModule } from "@lib/security";
import { MailModule } from "@lib/mail";
import { CartModule } from "@core/cart";
import { OAuthModule } from "@lib/OAuth2/oauth.module";

@Module({
    imports: [UserModule, MailModule, SecurityModule, CartModule, OAuthModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
