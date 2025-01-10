import { Module } from "@nestjs/common";
import { DbModule } from "@lib/db";
import { CategoryController } from "./controllers";
import { CategoryService } from "./services";
import { CloudinaryModule } from "@lib/cloudinary";

@Module({
    imports: [DbModule, CloudinaryModule],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService],
})
export class CategoryModule {}
