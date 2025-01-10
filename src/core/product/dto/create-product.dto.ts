import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, IsObject, ValidateNested, isArray } from "class-validator";
import { Type } from "class-transformer";

class MultilingualText {
    @ApiProperty({
        description: "Polish text",
        example: "Przykładowy produkt",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    pl: string;

    @ApiProperty({
        description: "Ukrainian text",
        example: "Приклад продукту",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    uk: string;

    @ApiProperty({
        description: "German text",
        example: "Beispielprodukt",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    de: string;
}

class Attribute {
    @ApiProperty({
        description: "Attribute type (e.g. width, height, depth)",
        example: "width",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    type: string;

    @ApiProperty({
        description: "Attribute type (e.g. Width, Height, Depth)",
        example: "Width",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    label: string;


    @ApiProperty({
        description: "Attribute value",
        example: "1200",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    value: string;
}

class MultilingualAttributes {
    @ApiProperty({
        description: "Polish attributes",
        example: [{ type: "Width", value: "1200" }, { type: "Height", value: "700" }, { type: "Depth", value: "750" }],
        required: true,
    })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Attribute)
    pl: Attribute[];

    @ApiProperty({
        description: "Ukrainian attributes",
        example: [{ type: "Ширина", value: "1200" }, { type: "Висота", value: "700" }, { type: "Глибина", value: "750" }],
        required: true,
    })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Attribute)
    uk: Attribute[];

    @ApiProperty({
        description: "German attributes",
        example: [{ type: "Breite", value: "1200" }, { type: "Höhe", value: "700" }, { type: "Tiefe", value: "750" }],
        required: true,
    })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Attribute)
    de: Attribute[];
}

export class CreateProductDto {
    @ApiProperty({
        description: "The multilingual name of the product",
        type: MultilingualText,
        required: true,
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => MultilingualText)
    name: MultilingualText;

    @ApiProperty({
        description: "The category of the product",
        example: "product slug",
        required: false,
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: "The category of the product",
        example: "63f15b9b9e7c8d001c6c7f28",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({
        description: "The multilingual description of the product",
        type: MultilingualText,
        required: true,
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => MultilingualText)
    description: MultilingualText;

    @ApiProperty({
        description: "The multilingual short description of the product",
        type: MultilingualText,
        required: true,
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => MultilingualText)
    short_description: MultilingualText;

    @ApiProperty({
        description: "The manufacturer of the product",
        example: "Sample Manufacturer",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    manufacturer: string;

    @ApiProperty({
        description: "The price of the product",
        example: 99.99,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({
        description: "The discount percentage of the product",
        example: 10,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    discount: number;

    @ApiProperty({
        description: "The quantity of the product in stock",
        example: 100,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @ApiProperty({
        description: "The images of the product",
        example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        required: true,
    })
    @IsOptional()
    @IsArray()
    images: any;

    @ApiProperty({
        description: "The available color for the product",
        example: "#000000",
        required: true,
    })
    @IsNotEmpty()
    @IsOptional()
    color: string;

    @ApiProperty({
        description: "The multilingual product attributes",
        type: MultilingualAttributes,
        required: true,
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => MultilingualAttributes)
    attributes: MultilingualAttributes;
}
