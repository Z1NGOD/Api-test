import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Queue } from "bullmq";

@Injectable()
export class EmailQueueService {
    private readonly emailQueue: Queue;

    constructor(private readonly configService: ConfigService) {
        this.emailQueue = new Queue("email-queue", {
            connection: {
                url: configService.get<string>("REDIS_URL"),
            },
        });
    }

    async addEmailJob(to: string, subject: string, templateName: string, data: unknown) {
        await this.emailQueue.add("send-email", {
            to,
            subject,
            templateName,
            data,
        });
        console.log(`Job added to queue: Email to ${to}`);
    }
}
