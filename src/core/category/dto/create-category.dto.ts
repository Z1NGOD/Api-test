import { IsString, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
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

export class CreateCategoryDto {
    @ApiProperty({
        description: "The multilingual name of the category",
        type: MultilingualText,
        required: true,
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => MultilingualText)
    name: MultilingualText;

    @ApiProperty({
        description: "The slug of the product",
        example: "sample-product",
        required: false,
    })
    @IsOptional()
    @IsString()
    slug: string;

    @ApiProperty({
        description: "Image of the category",
        example: "https://example.com/images/electronics.png",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    image: string;

    @ApiProperty({
        description: "The multilingual description of the category",
        type: MultilingualText,
        required: true,
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => MultilingualText)
    description: MultilingualText;
}
