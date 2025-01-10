import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteProductFromCart {
    @ApiProperty({
        description: "Product ID of the cart",
        example: "674734e9d38fb89eab3f708c",
    })
    @IsNotEmpty()
    @IsString()
    productId: string;
}
