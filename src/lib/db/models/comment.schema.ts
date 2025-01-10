import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "./user.schema";
import { Product } from "./product.schema";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true })
    text: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;

    @Prop({ required: false })
    rating: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Product" })
    product: Product;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Comment" })
    parent: Comment;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Comment", default: [] })
    replies: mongoose.Types.ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
