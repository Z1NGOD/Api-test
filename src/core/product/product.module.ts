import { Module } from "@nestjs/common";
import { ProductService } from "@core/product/services/product.service";
import { ProductController } from "@core/product/controllers/product.controller";
import { DbModule } from "@lib/db";
import { CloudinaryModule } from "@lib/cloudinary";

@Module({
    imports: [DbModule, CloudinaryModule],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
