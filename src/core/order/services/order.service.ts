import { Injectable } from "@nestjs/common";
import { CreateOrderDto, UpdateOrderDto } from "../dto";
import { OrderRepository } from "@lib/db/repositoires";
import { SearchOrderDto } from "../dto/search-order.dto";
import { EmailQueueService, MailService } from "@lib/mail/services";
import { ProductRepository } from "@lib/db/repositoires";

@Injectable()
export class OrderService {
    constructor(
        private readonly productRepository: ProductRepository, 
        private readonly mailRepository: MailService, 
        private readonly orderRepository: OrderRepository,
        private readonly emailQueueService: EmailQueueService,
    ) {}
    async create(userId: string, createOrderDto: CreateOrderDto) {
        const order = await this.orderRepository.create(userId, createOrderDto);

        const products = await Promise.all(order.cart.products.map(async (product) => {
            const findProduct = await (await this.productRepository.findOne(product.productId)).populate('images');
    
            if (!findProduct) {
                throw new Error(`Product not found`);
            }
    
            return {
                product: findProduct,
                amount: product.amount,
            };
        }));

        await this.mailRepository.onSendOrderUser(order, products);
    }

    findAll(userId: string, data: SearchOrderDto) {
        return this.orderRepository.findAll(userId, data);
    };

    findAllAdmin(userId: string, data: SearchOrderDto) {
        return this.orderRepository.findAllAdmin(userId, data);
    }

    findOne(userId: string, id: string) {
        return this.orderRepository.findOne(userId, id);
    }

    update(useriId: string, id: string, updateOrderDto: UpdateOrderDto) {
        return this.orderRepository.update(useriId, id, updateOrderDto);
    }

    remove(userId: string, id: string) {
        return this.orderRepository.remove(userId, id);
    }
}