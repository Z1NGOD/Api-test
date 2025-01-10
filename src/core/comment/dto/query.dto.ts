import { IsOptional, IsString } from "class-validator";

export class QueryDto {
    @IsOptional()
    @IsString()
    product: string;

    @IsOptional()
    @IsString()
    page: string;

    @IsOptional()
    @IsString()
    limit: string;
}
