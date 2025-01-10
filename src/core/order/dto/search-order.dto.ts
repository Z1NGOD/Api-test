import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class SearchOrderDto {
     @IsNotEmpty()
     @IsString()
     @IsOptional()
     @ApiProperty({
          description: "Order id to search for",
          required: false
     })
     id: string;

     @IsNotEmpty()
     @IsString()
     @IsOptional()
     @ApiProperty({
          description: "Order status to search for",
          required: false
     })
     status: string;

     @IsNotEmpty()
     @IsString()
     @IsOptional()
     @ApiProperty({
          description: "Page number for pagination",
          example: "2",
          required: true
     })
     page: string;

     @IsNotEmpty()
     @IsString()
     @IsOptional()
     @ApiProperty({
          description: "Number of records per page",
          example: "10",
          required: true
     })
     limit: string;
};
