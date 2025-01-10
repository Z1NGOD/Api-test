import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Cart } from "./cart.schema";
import { DeliveryAddress, ShippingMethod } from "@common/interfaces";
import { Status } from "@common/enums";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ versionKey: false, timestamps: true })
export class Order {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    orderId: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    mobile: string;

    @Prop({
        type: {
            country: { type: String, required: true },
            city: { type: String, required: true },
            street: { type: String, required: true },
            zipcode: { type: String, required: true },
        },
        required: true,
        _id: false,
    })
    deliveryAddress: DeliveryAddress;

    @Prop({
        type: {
            name: { type: String, required: true },
            price: { type: Number, required: true },
        },
        required: true,
        _id: false,
    })
    shippingMethod: ShippingMethod;

    @Prop({ type: Cart, required: true })
    cart: Cart;

    @Prop({ required: true })
    totalPrice: number;

    @Prop({ enum: Status, type: String, default: Status.Pending, required: true })
    status: Status;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
