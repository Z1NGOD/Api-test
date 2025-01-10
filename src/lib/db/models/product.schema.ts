import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Image } from "./image.schema";
import { Category } from "./category.schema";

interface MultilingualText {
    pl: string;
    uk: string;
    de: string;
}

interface Attribute {
    type: string;
    label: string;
    value: string;
}

interface MultilingualAttributes {
    pl: Attribute[];
    uk: Attribute[];
    de: Attribute[];
}

export type ProductDocument = HydratedDocument<Product>;

@Schema({ versionKey: false })
export class Product {
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

    @Prop({
        type: {
            pl: { type: String, required: true },
            uk: { type: String, required: true },
            de: { type: String, required: true },
        },
        _id: false,
        required: true,
    })
    short_description: MultilingualText;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    })
    category: Category;

    @Prop({ required: false })
    slug: string;

    @Prop({ required: true, default: 0 })
    rating: number;

    @Prop({ required: true })
    manufacturer: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: false })
    discount: number;

    @Prop({ required: true })
    stock: number;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }])
    images: Image[];

    @Prop({ required: false })
    color: string;

    @Prop({
        type: {
            pl: { type: mongoose.Schema.Types.Mixed, required: true },
            uk: { type: mongoose.Schema.Types.Mixed, required: true },
            de: { type: mongoose.Schema.Types.Mixed, required: true },
        },
        _id: false,
        required: true,
    })
    attributes: MultilingualAttributes;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
