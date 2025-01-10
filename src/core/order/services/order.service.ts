import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateOrderDto, UpdateOrderDto } from "../dto";
import { OrderRepository } from "@lib/db/repositoires";
import { SearchOrderDto } from "../dto/search-order.dto";
import { PaymentService } from "@lib/payment/services/payment.service";

@Injectable()
export class OrderService {
    constructor(private readonly orderRepository: OrderRepository, private readonly paymentService: PaymentService) {}
    async create(userId: string, createOrderDto: CreateOrderDto) {
        const payment = await this.paymentService.createPayment({
            amount: createOrderDto.totalPrice,
            description: `Order for ${createOrderDto.firstName} ${createOrderDto.lastName}`,
            payer: {
                name: createOrderDto.firstName + createOrderDto.lastName,
                email: createOrderDto.email,
            },
        });
        if (!payment) throw new BadRequestException("problem with payment");
        const order = await this.orderRepository.create(userId, createOrderDto, payment.transactionId);
        return {
            order,
            transactionUrl: payment.transactionUrl,
        };
    }

    findAll(userId: string, data: SearchOrderDto) {
        return this.orderRepository.findAll(userId, data);
    }

    findAllAdmin(userId: string, data: SearchOrderDto) {
        return this.orderRepository.findAllAdmin(userId, data);
    }

    findOne(userId: string, id: string) {
        return this.orderRepository.findOne(userId, id);
    }

    update(userId: string, id: string, updateOrderDto: UpdateOrderDto) {
        return this.orderRepository.update(userId, id, updateOrderDto);
    }

    remove(userId: string, id: string) {
        return this.orderRepository.remove(userId, id);
    }
}
