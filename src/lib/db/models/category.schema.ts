import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Image } from "./image.schema";

interface MultilingualText {
    pl: string;
    uk: string;
    de: string;
}

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
    @Prop({
        type: {
            pl: { type: String, required: true },
            uk: { type: String, required: true },
            de: { type: String, required: true },
        },
        _id: false,
        required: true,
    })
    name: MultilingualText;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({
        type: {
            pl: { type: String, required: true },
            uk: { type: String, required: true },
            de: { type: String, required: true },
        },
        _id: false,
        required: true,
    })
    description: MultilingualText;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Image" })
    image: Image;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
