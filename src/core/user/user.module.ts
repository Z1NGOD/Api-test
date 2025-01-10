import { Module } from "@nestjs/common";
import { UserService } from "./services";
import { UserController } from "./controllers";
import { DbModule } from "@lib/db";
import { CloudinaryModule } from "@lib/cloudinary";
import { SecurityModule } from "@lib/security";

@Module({
    imports: [DbModule, SecurityModule, CloudinaryModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
