import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartDocument } from "../models";
import { Model, Types } from "mongoose";
import { CreateCartDto, UpdateCartDto, UpdateProductInCart } from "@core/cart/dto";

@Injectable()
export class CartRepository {
    constructor(@InjectModel(Cart.name) private readonly CartModel: Model<Cart>) {}

    async create(createCartDto: CreateCartDto): Promise<CartDocument> {
        return await this.CartModel.create(createCartDto);
    }

    async add(userId: string, updateCartDto: UpdateCartDto): Promise<CartDocument> {
        const cart = await this.CartModel.findOne({ user_id: userId });
        const { productId, amount } = updateCartDto;

        if (!cart) {
            throw new NotFoundException("Cart not found");
        }

        if (amount > 15) {
            throw new BadRequestException("Amount cannot exced 15");
        }

        const productExists = cart.products.find(p => p.productId.toString() === productId);

        if (productExists) {
            if (productExists.amount + amount > 15) {
                throw new BadRequestException("Total amount of this product cannot exceed 15");
            }

            productExists.amount += amount;
        } else {
            cart.products.push({ productId, amount });
        }

        cart.amount = cart.products.reduce((total, p) => total + p.amount, 0);

        return (await cart.save()).populate({
            path: "products.productId",
            populate: {
                path: "images",
                model: "Image",
            },
        });
    }

    async findById(cartId: string): Promise<CartDocument> {
        const cart = await this.CartModel.findById(cartId)

        if (!cart) {
            throw new NotFoundException("Cart not found");
        }

        return cart;
    }

    async findByUserId(userId: string): Promise<CartDocument | null> {
        const user_id = new Types.ObjectId(userId);

        const result = await this.CartModel.aggregate([
            {
                $match: { user_id },
            },
            {
                $unwind: "$products",
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            {
                $unwind: "$productDetails",
            },
            {
                $lookup: {
                    from: "images",
                    localField: "productDetails.images",
                    foreignField: "_id",
                    as: "productDetails.images",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    user_id: { $first: "$user_id" },
                    products: {
                        $push: {
                            product: "$productDetails",
                            amount: "$products.amount",
                            color: "$products.color",
                        },
                    },
                    amount: { $sum: "$products.amount" },
                },
            },
        ]);

        return result[0];
    }

    async update(userId: string, updateCartDto: UpdateProductInCart) {
        const cart = await this.CartModel.findOne({ user_id: userId });
        const { productId, amount } = updateCartDto;

        if (!cart) {
            throw new NotFoundException("Cart not found");
        }

        if (amount > 15) {
            throw new BadRequestException("Amount cannot exceed 15");
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex === -1) {
            throw new NotFoundException("Product not found in cart");
        }

        const product = cart.products[productIndex];

        if (amount) {
            product.amount = amount;
        }

        cart.amount = cart.products.reduce((total, p) => total + p.amount, 0);
        return await cart.save();
    }

    async clear(userId: string) {
        const cart = await this.CartModel.findOne({ user_id: userId });

        if (!cart) {
            throw new NotFoundException("Cart not found");
        }

        cart.products = [];
        cart.amount = 0;

        return await cart.save();
    }

    async remove(userId: string, productId: string) {
        const cart = await this.CartModel.findOne({ user_id: userId });

        if (!cart) {
            throw new NotFoundException("Cart not found");
        }

        const product = cart.products.find(p => p.productId.toString() === productId);

        if (!product) {
            throw new BadRequestException("Product not in cart");
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);

        cart.amount = cart.products.reduce((total, p) => total + p.amount, 0);

        return await cart.save();
    }
}
