import { CreatePaymentDto } from "@lib/payment/dto/createPaymentDto.dto";
import { PaymentService } from "@lib/payment/services/payment.service";
import { Body, Controller, Post, Headers } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("payments")
@ApiTags("Payments")
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post("create")
    async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return await this.paymentService.createPayment(createPaymentDto);
    }

    @Post("notify")
    async logAndReturnNotification(@Body() body, @Headers("x-jws-signature") jws) {
        return {
            body,
            jws,
        };
    }
}
