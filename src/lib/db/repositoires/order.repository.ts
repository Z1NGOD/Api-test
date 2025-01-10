import { InjectModel } from "@nestjs/mongoose";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Order, OrderDocument } from "../models";
import { CreateOrderDto, UpdateOrderDto } from "@core/order/dto";
import { CartRepository } from './cart.repository';
import { ProductRepository } from "./product.repository";
import { SearchOrderDto } from "@core/order/dto/search-order.dto";
import { UserRepository } from "./user.repository";
import { Roles } from "@common/enums";

@Injectable()
export class OrderRepository {
    constructor(
        @InjectModel(Order.name) private readonly OrderModel: Model<Order>, 
        private readonly cartRepository: CartRepository,
        private readonly productRepository: ProductRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async create(userId: string, createOrderDto: CreateOrderDto): Promise<OrderDocument> {
        const cart = await this.cartRepository.findById(createOrderDto.cart);

        cart.products.map(async (item) => {
            const product = await this.productRepository.findOne(item.productId);

            if (!product) {
                throw new Error(`Product not found`);
            }

            if (product.stock < item.amount) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }

            await this.productRepository.update(item.productId, {
                stock: product.stock - item.amount,
            });
        })

        return await this.OrderModel.create({
            userId,
            orderId: Math.floor(100000 + Math.random() * 900000),
            ...createOrderDto,
            cart: cart,
        });
    }

    async findAll(userId: string, data: SearchOrderDto) {
        const page: number = Number(data.page) || 1;
        const limit: number = Math.min(Number(data.limit) || 10, 50);
    
        const skip = (page - 1) * limit;
    
        const matchFilter: any = { userId };
        if (data.id) {
            matchFilter.orderId = { $regex: data.id, $options: "i" };
        }
    
        if (data.status) {
            matchFilter.status = { $in: data.status.split(",") };
        }
    
        const [orders, total] = await Promise.all([
            this.OrderModel.aggregate([
                { $match: matchFilter },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
            ]),
            this.OrderModel.countDocuments(matchFilter),
        ]);
    
        const pages = Math.ceil(total / limit);
    
        return {
            orders,
            total,
            pages,
            hasNext: page < pages,
            hasPrev: page > 1,
            nextPage: page < pages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
        };
    };

    async findAllAdmin(userId: string, data: SearchOrderDto) {
        const user = await this.userRepository.findOne(userId);
        if (user.role != Roles.Admin) {
            throw new ForbiddenException('You are not allowed to see orders');
        }

        const page: number = Number(data.page) || 1;
        const limit: number = Math.min(Number(data.limit) || 10, 50);
    
        const skip = (page - 1) * limit;
    
        const matchFilter: any = {};
        if (data.id) {
            matchFilter.orderId = { $regex: data.id, $options: "i" };
        }
    
        if (data.status) {
            matchFilter.status = { $in: data.status.split(",") };
        }
    
        const [orders, total] = await Promise.all([
            this.OrderModel.aggregate([
                { $match: matchFilter },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
            ]),
            this.OrderModel.countDocuments(matchFilter),
        ]);
    
        const pages = Math.ceil(total / limit);
    
        return {
            orders,
            total,
            pages,
            hasNext: page < pages,
            hasPrev: page > 1,
            nextPage: page < pages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
        };
    }

    async findOne(userId: string, _id: string): Promise<OrderDocument> {
        return await this.OrderModel.findOne({ userId, _id }).populate("cart");
    }

    async update(userId: string, _id: string, updateOrderDto: UpdateOrderDto): Promise<OrderDocument> {
        return await this.OrderModel.findOneAndUpdate({ userId, _id }, { ...updateOrderDto }).populate("cart");
    }

    async remove(userId: string, _id: string): Promise<void> {
        return await this.OrderModel.findOneAndDelete({ userId, _id });
    }
}
