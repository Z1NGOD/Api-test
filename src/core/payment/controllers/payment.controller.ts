import { PaymentService } from "@lib/payment/services/payment.service";
import { BadRequestException, Body, Controller, Headers, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentNotificationDto } from "../dto/payment-notification.dto";
import { Status } from "@common/enums";

@Controller("payments")
@ApiTags("Payments")
export class PaymentController {
    constructor(private readonly payentService: PaymentService) {}
    @Post("notify")
    async logAndReturnNotification(@Body() body: PaymentNotificationDto, @Headers("x-jws-signature") jws: string) {
        if ((await this.payentService.getStatus(body.tr_id)).status === Status.Confirmed) return;

        if (!jws) {
            throw new BadRequestException("no jws");
        }

        const isValid = await this.payentService.verifyJws(jws);

        if (!isValid) {
            throw new BadRequestException("Bad jws");
        }

        if (body.tr_status === "TRUE") {
            await this.payentService.updateByTransactionId(body.tr_id, Status.Confirmed);
        }
    }
}
