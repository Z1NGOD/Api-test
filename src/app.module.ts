import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "@lib/db";
import { AuthModule } from "@core/auth";
import { UserModule } from "@core/user";
import { ProductModule } from "@core/product";
import { SecurityModule } from "@lib/security";
import { CloudinaryModule } from "@lib/cloudinary";
import { cloudinaryConfig } from "@lib/cloudinary/configs/cloudinary.config";
import { CommentModule } from "@core/comment/comment.module";
// import { MailModule } from "@lib/mail";
import { CartModule } from "@core/cart";
import { CategoryModule } from "@core/category/category.module";
import { OrderModule } from "./core/order/order.module";
import { PaymentModule } from "@lib/payment/payment.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [cloudinaryConfig] }),
        // DbModule,
        // AuthModule,
        // UserModule,
        // SecurityModule,
        // CloudinaryModule,
        // MailModule,
        // CommentModule,
        // ProductModule,
        // CartModule,
        // CategoryModule,
        // OrderModule,
        PaymentModule,
    ],
})
export class AppModule {}
