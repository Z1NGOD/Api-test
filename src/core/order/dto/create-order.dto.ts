import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsMobilePhone, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class DeliveryAddress {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, example: "USA" })
    country: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, example: "New York" })
    city: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, example: "123 Main St" })
    street: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, example: "10001" })
    zipcode: string;
}

export class ShippingMethod {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, example: "Standard Shipping" })
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ type: Number, example: 10 })
    price: number;
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, example: "John" })
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, example: "Doe" })
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ type: String, example: "john.doe@example.com" })
    email: string;

    @IsNotEmpty()
    @IsMobilePhone()
    @ApiProperty({ type: String, example: "+14155552671" })
    mobile: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DeliveryAddress)
    @ApiProperty({ type: DeliveryAddress })
    deliveryAddress: DeliveryAddress;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ShippingMethod)
    @ApiProperty({ type: ShippingMethod })
    shippingMethod: ShippingMethod;

    @IsNotEmpty()
    @IsMongoId()
    @ApiProperty({ type: String, example: "675ad66b54761bcee9c0aab5" })
    cart: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ type: Number, example: 110 })
    totalPrice: number;
}
