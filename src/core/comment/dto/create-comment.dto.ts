import { IsString, IsNumber, IsOptional, IsMongoId, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CommentCreateDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        name: "text",
        description: "Content of the comment",
        example: "Nice product!",
    })
    text: string;

    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    @ApiProperty({
        name: "rating",
        type: Number,
        required: false,
        description: "Rating of the product",
        example: 4,
        minimum: 0,
        maximum: 5,
    })
    rating?: number;

    @IsMongoId()
    @ApiProperty({
        name: "product",
        type: String,
        required: true,
        description: "ID of the product being commented on",
        example: "63f15b9b9e7c8d001c6c7f30",
    })
    product: string;

    @IsMongoId()
    @IsOptional()
    @ApiProperty({
        name: "parent",
        type: String,
        required: false,
        description: "ID of the parent comment (if replying to another comment)",
        example: "63f15b9b9e7c8d001c6c7f32",
    })
    parent: string;

    @IsMongoId()
    @IsOptional()
    @ApiProperty({
        name: "user",
        type: String,
        required: false,
        description: "ID of the user making the comment",
        example: "63f15b9b9e7c8d001c6c7f31",
    })
    user: string;
}
