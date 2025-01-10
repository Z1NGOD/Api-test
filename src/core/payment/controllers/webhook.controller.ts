import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { WebhookService } from "@lib/payment/services/webhook.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Webhook")
@Controller("webhook")
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}

    @Post()
    async handleWebhook(@Req() req: any, @Res() res: Response, @Body() body: unknown) {
        try {
            // Get JWS signature from headers
            const jwsSignature = req.headers["x-jws-signature"];
            console.log(jwsSignature);
            console.log(body);
            if (!jwsSignature) {
                return res.status(400).send("Missing JWS signature");
            }

            // Log raw and parsed body for debugging
            console.log("Raw Body:", req.rawBody);
            console.log("Parsed Body:", req.body);

            // Verify the signature
            const isValid = await this.webhookService.verifySignature(jwsSignature as string, req.rawBody);
            if (!isValid) {
                return res.status(400).send("Invalid JWS signature");
            }

            // Process the notification
            await this.webhookService.processNotification(req.body);

            return res.status(200).send("Webhook processed successfully");
        } catch (error) {
            console.error("Webhook error:", error.message);
            return res.status(500).send("Internal Server Error");
        }
    }
}
