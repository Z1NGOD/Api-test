import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Image, ImageDocument } from "../models";

@Injectable()
export class ImageRepository {
    constructor(@InjectModel(Image.name) private readonly imageModel: Model<Image>) {}

    async create(public_id: string, url: string): Promise<ImageDocument> {
        return await this.imageModel.create({ public_id, url });
    }

    async remove(public_id: string): Promise<void> {
        return await this.imageModel.findOneAndDelete({ public_id });
    }
}
