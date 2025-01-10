import { Injectable } from "@nestjs/common";
import { createVerify, X509Certificate } from "crypto";

@Injectable()
export class WebhookService {
    async verifySignature(jws: string, rawBody: string): Promise<boolean> {
        try {
            // Parse the JWS header and signature
            const [headerPart, payloadPart, signaturePart] = jws.split(".");
            if (!headerPart || !payloadPart || !signaturePart) {
                throw new Error("Malformed JWS");
            }

            // Decode and parse JWS header
            const headerDecoded = Buffer.from(headerPart.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
            const headerJson = JSON.parse(headerDecoded);

            if (!headerJson.x5u) {
                throw new Error("Missing x5u in JWS header");
            }

            if (!headerJson.x5u.startsWith("https://secure.tpay.com")) {
                throw new Error("Invalid x5u URL");
            }

            // Fetch signing and CA certificates
            const [signingCert, caCert] = await Promise.all([this.fetchCertificate(headerJson.x5u), this.fetchCertificate("https://secure.tpay.com/x509/tpay-jws-root.pem")]);

            // Verify the signing certificate
            const x5uCert = new X509Certificate(signingCert);
            const caCertPublicKey = new X509Certificate(caCert).publicKey;
            if (!x5uCert.verify(caCertPublicKey)) {
                throw new Error("Signing certificate is not signed by the CA");
            }

            // Prepare payload for verification
            const payload = Buffer.from(rawBody, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

            // Decode the signature
            const decodedSignature = Buffer.from(signaturePart.replace(/-/g, "+").replace(/_/g, "/"), "base64");

            // Verify the signature
            const verifier = createVerify("SHA256");
            verifier.update(`${headerPart}.${payload}`);
            verifier.end();

            return verifier.verify(x5uCert.publicKey, decodedSignature);
        } catch (error) {
            console.error("Signature verification error:", error.message);
            return false;
        }
    }

    async processNotification(body: any) {
        // Process the notification
        console.log("Processing notification with body:", body);

        const transactionId = body.transaction_id;
        const status = body.status;

        console.log(`Transaction ${transactionId} settled with status: ${status}`);

        // Example: Update database or trigger business logic
    }

    private async fetchCertificate(url: string): Promise<string> {
        const axios = require("axios");
        const response = await axios.get(url, { responseType: "text" });
        return response.data;
    }
}
