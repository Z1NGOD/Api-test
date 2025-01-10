import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { EmailQueueService, MailService } from "./services";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                transport: {
                    service: config.get("EMAIL_SERVICE"),
                    port: config.get("EMAIL_PORT"),
                    secure: false,
                    auth: {
                        user: config.get("EMAIL_USER"),
                        pass: config.get("EMAIL_PASS"),
                    },
                },

                defaults: {
                    from: '"No Reply" <no-reply@example.com>',
                },

                template: {
                    dir: join(__dirname, "..", "..", "..", "src", "lib", "mail", "templates"),
                    adapter: new EjsAdapter(),
                },

                preview: true,
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [MailService, EmailQueueService],
    exports: [MailService, EmailQueueService],
})
export class MailModule {}
