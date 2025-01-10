import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
    @Prop({ required: true })
    public_id: string;

    @Prop({ required: true })
    url: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
