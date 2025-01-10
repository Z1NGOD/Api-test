import { Module } from "@nestjs/common";
import { OrderService } from "./services";
import { OrderController } from "./controllers";
import { DbModule } from "@lib/db";
import { PaymentModule } from "@lib/payment/payment.module";

@Module({
    imports: [DbModule, PaymentModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
