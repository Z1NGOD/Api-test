import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./create-category.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
     @ApiProperty({
          description: "Image of the category",
          example: "https://example.com/images/electronics.png",
          required: true,
      })
      @IsString()
      @IsOptional()
      image?: string;
}
