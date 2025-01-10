import { Module } from "@nestjs/common";
import { PaymentService } from "./services/payment.service";
import { ConfigModule } from "@nestjs/config";
import { paymentConfig } from "./config/payment.config";
import { HttpModule } from "@nestjs/axios";
import { PaymentController } from "@core/payment/controllers/payment.controller";
import { DbModule } from "@lib/db";

@Module({
    imports: [ConfigModule.forFeature(paymentConfig), HttpModule, DbModule],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule {}
