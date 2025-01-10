import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Order, Product, User } from "@lib/db/models";
import { ConfigService } from "@nestjs/config";

interface Products {
    amount: number;
    product: Product;
}

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {}

    public async onSendWelcome(user: User): Promise<void> {
        await this.mailerService.sendMail({
            from: this.configService.get("EMAIL_USER"),
            to: user.email,
            subject: `Welcome to Armatura Outlet`,
            template: "welcome.ejs",
            context: {
                username: user.name,
            },
        });
    }

    public async onSendOrderUser(order: Order, products: any): Promise<void> {
        await this.mailerService.sendMail({
            from: this.configService.get("EMAIL_USER"),
            to: order.email,
            subject: `Twoje zamówienie w Armatura Outlet`,
            template: "order.ejs",
            context: {
                order: order,
                products: products,
            },
        });
    }

    public async onSendForgotPassword(user: User, token: string): Promise<void> {
        await this.mailerService.sendMail({
            from: this.configService.get("EMAIL_USER"),
            to: user.email,
            subject: `Armatura Outlet - resetowanie hasła`,
            template: "forgot-password.ejs",
            context: {
                username: user.name,
                reset_link: `https://armatura-outlet.com/pl/reset-password/?token=${token}`,
            },
        });
    }
}
