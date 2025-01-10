import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { PaymentAuthDto } from "../dto/payment-auth.dto";
import { CreatePaymentDto } from "../dto/createPaymentDto.dto";

@Injectable()
export class PaymentService {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

    async AuthClient() {
        return await lastValueFrom(
            this.httpService.post<PaymentAuthDto>(`${this.configService.get("PAYMENT_API_URL")}/oauth/auth`, {
                client_id: this.configService.get("PAYMENT_CLIENT_ID"),
                client_secret: this.configService.get("PAYMENT_CLIENT_SECRET"),
            }),
        );
    }

    async createPayment(createPaymentDto: CreatePaymentDto) {
        console.log(createPaymentDto);
        const auth = await this.AuthClient();
        const payment = await lastValueFrom(
            this.httpService.post(
                `${this.configService.get("PAYMENT_API_URL")}/transactions`,
                {
                    amount: createPaymentDto.amount,
                    description: createPaymentDto.description,
                    payer: { name: createPaymentDto.payer.name, email: createPaymentDto.payer.email },
                },
                {
                    headers: {
                        Authorization: `${auth.data.token_type} ${auth.data.access_token}`,
                    },
                },
            ),
        );
        return payment.data.transactionPaymentUrl;
    }
}
