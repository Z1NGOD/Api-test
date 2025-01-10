import { registerAs } from "@nestjs/config";

export const paymentConfig = registerAs("payment-config", () => ({
    paymentClientId: process.env.TPAY_CLIENT_ID,
    paymentSecret: process.env.TPAY_SECRET,
}));
