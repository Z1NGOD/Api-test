import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        req.rawBody = ""; // To store raw body for signature verification
        req.on("data", (chunk: Buffer) => {
            req.rawBody += chunk.toString();
        });
        req.on("end", () => {
            // Parse form data only if content type is `application/x-www-form-urlencoded`
            if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
                const querystring = require("querystring");
                req.body = querystring.parse(req.rawBody); // Parse form data into JSON-like object
            }
            next();
        });
    }
}
