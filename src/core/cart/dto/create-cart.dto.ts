import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCartDto {
    @ApiProperty({
        description: "User ID of the cart",
        example: "6754a85ce44cfd7e0606c9b7",
    })
    @IsString()
    @IsNotEmpty()
    user_id: string;
}
