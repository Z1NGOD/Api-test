import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min, validateSync } from "class-validator";

class EnvironmentVariables {
    @IsString()
    @IsNotEmpty()
    DB_URI: string;

    @IsNumber()
    @Min(0)
    @Max(65535)
    @IsNotEmpty()
    PORT: number;

    @IsString()
    @IsNotEmpty()
    HOST: string;

    @IsString()
    @IsNotEmpty()
    ACCESS_SECRET: string;

    @IsString()
    @IsNotEmpty()
    REFRESH_SECRET: string;

    @IsNumber()
    @IsNotEmpty()
    ACCESS_EXPIRE_TIME: number;

    @IsNumber()
    @IsNotEmpty()
    REFRESH_EXPIRE_TIME: number;

    @IsString()
    @IsNotEmpty()
    EMAIL_USER: string;

    @IsString()
    @IsNotEmpty()
    EMAIL_PASS: string;

    @IsString()
    @IsNotEmpty()
    EMAIL_SERVICE: string;

    @IsString()
    @IsNotEmpty()
    EMAIL_HOST: string;

    @IsNumber()
    @IsNotEmpty()
    EMAIL_PORT: number;

    @IsString()
    @IsNotEmpty()
    CLOUDINARY_API_KEY: string;

    @IsString()
    @IsNotEmpty()
    CLOUDINARY_API_NAME: string;

    @IsString()
    @IsNotEmpty()
    CLOUDINARY_API_SECRET: string;

    @IsString()
    @IsNotEmpty()
    CLOUDINARY_API_FOLDER: string;
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
