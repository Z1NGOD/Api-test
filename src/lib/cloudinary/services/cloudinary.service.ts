import { BadRequestException, Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
    public async uploadFile(file: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        try {
            return await cloudinary.uploader.upload(file, {
                folder: process.env.CLOUDINARY_API_FOLDER,
                crop: "fill",
                format: "jpg",
                resource_type: "image",
            });
        } catch (error) {
            throw new BadRequestException(`Failed to upload file from cloudinary: ${error.message}`);
        }
    }

    public async updateFile(file: string, public_id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        try {
            await this.destroyFile(public_id);
            return await this.uploadFile(file);
        } catch (error) {
            throw new BadRequestException(`Failed to update file from cloudinary: ${error.message}`);
        }
    }

    public async destroyFile(public_id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        try {
            return await cloudinary.uploader.destroy(public_id);
        } catch (error) {
            throw new BadRequestException(`Failed to destroy file from cloudinary: ${error.message}`);
        }
    }
}
