import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsOptional, IsNumber, ValidateNested, IsObject } from "class-validator";

export class SearchProductDto {
    @ApiProperty({
        description: "Product name",
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: "Product manufacturer",
        required: false,
    })
    @IsOptional()
    @IsString()
    manufacturer: any;

    @ApiProperty({
        description: "Product category",
        required: false,
    })
    @IsString()
    @IsOptional()
    category: any;

    @ApiProperty({
        description: "Additional filters as key-value pairs",
        required: false,
        type: Object,
    })
    @IsOptional()
    @IsString()
    attributes?: Record<string, any>;

    @ApiProperty({
        description: "Filter by product discount (true/false)",
        required: false,
    })
    @IsOptional()
    @IsString()
    discount: string;

    @ApiProperty({
        description: "Minimum product price",
        required: false,
    })
    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @ApiProperty({
        description: "Maximum product price",
        required: false,
    })
    @IsOptional()
    @IsNumber()
    maxPrice?: number;

    @ApiProperty({
        description: "Sort by price (asc/desc)",
        required: false,
        enum: ["asc", "desc"],
    })
    @IsOptional()
    @IsString()
    sortByPrice?: "asc" | "desc";

    @ApiProperty({
        description: "Sort by name (asc/desc)",
        required: false,
        enum: ["asc", "desc"],
    })
    @IsOptional()
    @IsString()
    sortByName?: "asc" | "desc";

    @ApiProperty({
        description: "Sort by rating (asc/desc)",
        required: false,
        enum: ["asc", "desc"],
    })
    @IsOptional()
    @IsString()
    sortByRating?: "asc" | "desc";
}
