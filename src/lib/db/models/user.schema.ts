import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Product } from "./product.schema";
import { Roles } from "@common/enums";
import { Image } from "./image.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    password: string;

    @Prop({ required: false })
    mobile: string;

    @Prop({ required: true, type: String, enum: Roles, default: Roles.User })
    role: Roles;

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ])
    favorites: Product[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Image" })
    avatar: Image;

    @Prop({ type: String, required: false, default: null })
    resetPasswordToken?: string | null;

    @Prop({ type: Date, required: false, default: null })
    resetPasswordExpires?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
