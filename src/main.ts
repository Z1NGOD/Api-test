import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bodyParser from "body-parser";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api/v1", { exclude: ["api-docs"] });

    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

    const config = new DocumentBuilder()
        .setTitle("Armatura Outlet API")
        .setDescription("API for Armatura Outlet")
        .setVersion("0.0.1")
        .addBearerAuth({
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            name: "JWT",
            description: "Enter JWT token",
            in: "header",
        })
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api-docs", app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            stopAtFirstError: true,
            transformOptions: {
                enableImplicitConversion: true,
                exposeUnsetFields: false,
            },
        }),
    );

    app.use(helmet());

    const corsOptions = {
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    };

    app.enableCors(corsOptions);

    const configService = app.get(ConfigService);
    const port = configService.get<string>("PORT");
    const host = configService.get<string>("HOST");

    await app.listen(port, "", () => {
        Logger.log(`Server is running on: http://${host}:${port}`);
    });
}
bootstrap();
