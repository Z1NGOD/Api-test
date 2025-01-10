import { Module } from "@nestjs/common";
import { AuthController } from "./controllers";
import { AuthService } from "./services";
import { UserModule } from "../user";
import { SecurityModule } from "@lib/security";
import { CartModule } from "@core/cart";

@Module({
    imports: [UserModule, SecurityModule, CartModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
