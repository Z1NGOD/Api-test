import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductInCart {
    @ApiProperty({
        description: "Product ID of the cart",
        example: "674734e9d38fb89eab3f708c",
    })
    @IsNotEmpty()
    @IsString()
    productId: string;

    @ApiProperty({ description: "Amount of the product in the cart", example: 5 })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(15)
    amount: number;
}
