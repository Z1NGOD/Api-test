import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConstant } from "@lib/cloudinary/constants/cloudinary.constant";

export const CloudinaryProvider: Provider = {
    provide: cloudinaryConstant.CLOUDINARY,
    useFactory: async (config: ConfigService) => {
        cloudinary.config({
            cloud_name: config.get<string>("cloudinary.cloud_name"),
            api_key: config.get<string>("cloudinary.api_key"),
            api_secret: config.get<string>("cloudinary.api_secret"),
        });

        return cloudinary;
    },

    inject: [ConfigService],
};
