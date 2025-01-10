import { registerAs } from "@nestjs/config";

export const OAuth2Config = registerAs("google-oauth", () => ({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CLIENT_URL,
}));
