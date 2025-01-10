import { Module } from "@nestjs/common";
import { CartService } from "./services";
import { CartController } from "./controllers";
import { DbModule } from "@lib/db";

@Module({
    imports: [DbModule],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule {}
