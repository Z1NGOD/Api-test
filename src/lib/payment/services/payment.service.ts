import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { PaymentAuthDto } from "../dto/payment-auth.dto";
import { CreatePaymentDto } from "../dto/createPaymentDto.dto";
import { OrderRepository } from "@lib/db/repositoires";
import { Status } from "@common/enums";

@Injectable()
export class PaymentService {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService, private readonly orderResopistory: OrderRepository) {}

    async createPayment(createPaymentDto: CreatePaymentDto) {
        const auth = await this.AuthClient();
        const payment = await lastValueFrom(
            this.httpService.post(`${this.configService.get("PAYMENT_API_URL")}/transactions`, createPaymentDto, {
                headers: {
                    Authorization: `${auth.data.token_type} ${auth.data.access_token}`,
                },
            }),
        );
        return {
            transactionUrl: payment.data.transactionPaymentUrl,
            transactionId: payment.data.transactionId,
        };
    }

    async verifyJws(jws: string) {
        return true;
    }

    async updateByTransactionId(transactionId: string, status: Status) {
        await this.orderResopistory.updateByTransactionId(transactionId, status);
    }

    private async AuthClient() {
        return await lastValueFrom(
            this.httpService.post<PaymentAuthDto>(`${this.configService.get("PAYMENT_API_URL")}/oauth/auth`, {
                client_id: this.configService.get("PAYMENT_CLIENT_ID"),
                client_secret: this.configService.get("PAYMENT_CLIENT_SECRET"),
            }),
        );
    }
}
