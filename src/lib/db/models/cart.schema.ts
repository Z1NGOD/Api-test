import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "./user.schema";

export type CartDocument = HydratedDocument<Cart>;

@Schema({ versionKey: false })
export class Cart {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user_id: User;

    @Prop({
        type: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                amount: { type: Number, required: true },
            },
        ],
        default: [],
        _id: false,
    })
    products: { productId: string; amount: number }[];

    @Prop({ default: 0 })
    amount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
