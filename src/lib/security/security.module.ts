import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenService, PasswordService } from "./services";
import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategies";
import { DbModule } from "@lib/db";

@Module({
    imports: [JwtModule.register({}), DbModule],
    providers: [TokenService, AccessTokenStrategy, RefreshTokenStrategy, PasswordService],
    exports: [TokenService, PasswordService],
})
export class SecurityModule {}
