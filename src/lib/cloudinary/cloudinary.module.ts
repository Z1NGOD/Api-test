import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "@lib/cloudinary/providers/cloudinary.provider";
import { CloudinaryService } from "@lib/cloudinary/services/cloudinary.service";

@Module({
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
