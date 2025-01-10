import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { PaymentService } from "./services/payment.service";
import { ConfigModule } from "@nestjs/config";
import { paymentConfig } from "./config/payment.config";
import { HttpModule } from "@nestjs/axios";
import { PaymentController } from "@core/payment/controllers/payment.controller";
import { WebhookController } from "@core/payment/controllers/webhook.controller";
import { WebhookService } from "./services/webhook.service";
import { RawBodyMiddleware } from "./middlewares/rawBodyMiddleware.middleware";

@Module({
    imports: [ConfigModule.forFeature(paymentConfig), HttpModule],
    controllers: [PaymentController, WebhookController],
    providers: [PaymentService, WebhookService],
    exports: [PaymentService],
})
export class PaymentModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RawBodyMiddleware).forRoutes("webhook");
    }
}
