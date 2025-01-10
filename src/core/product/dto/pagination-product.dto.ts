import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({
        description: "Page number for pagination",
        example: 1,
        minimum: 1,
    })
    @IsNumber()
    @Min(1)
    page: number;

    @ApiProperty({
        description: "Number of items per page",
        example: 10,
        minimum: 1,
    })
    @IsNumber()
    @Min(1)
    limit: number;
}
