import { PaymentService } from "@lib/payment/services/payment.service";
import { BadRequestException, Body, Controller, Headers, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentNotificationDto } from "../dto/payment-notification.dto";
import { Status } from "@common/enums";

@Controller("payments")
@ApiTags("Payments")
export class PaymentController {
    constructor(private readonly payentService: PaymentService) {}
    @Post("notify")
    async logAndReturnNotification(@Body() body: any) {
        Logger.log(body);
        // if ((await this.payentService.checkThePaymentStatus(body.tr_id, Status.Confirmed)) === false) return;
        //
        // if (!jws) {
        //     throw new BadRequestException("no jws");
        // }
        //
        // const isValid = await this.payentService.verifyJws(jws);
        //
        // if (!isValid) {
        //     throw new BadRequestException("Bad jws");
        // }

        if (body.tr_status === "TRUE") {
            const payment = this.payentService.updateByTransactionId(body.tr_id, Status.Confirmed);
            Logger.log("Check the payment, we got this boysss");
            Logger.log(payment);
        }
    }
}
