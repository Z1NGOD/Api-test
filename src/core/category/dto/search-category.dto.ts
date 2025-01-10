import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class SearchCategoryDto {
     @IsNotEmpty()
     @IsString()
     @IsOptional()
     @ApiProperty({
          description: "Category name to search for",
          example: "example-category",
          required: false
     })
     name: string;

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
