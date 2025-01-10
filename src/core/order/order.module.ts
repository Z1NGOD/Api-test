import { Module } from "@nestjs/common";
import { OrderService } from "./services";
import { OrderController } from "./controllers";
import { DbModule } from "@lib/db";
import { MailModule } from "@lib/mail";

@Module({
    imports: [DbModule, MailModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
