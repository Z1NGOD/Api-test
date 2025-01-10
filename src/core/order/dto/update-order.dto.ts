import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateOrderDto } from "./create-order.dto";
import { Status } from "@common/enums";
import { Optional } from "@nestjs/common";
import { IsEnum } from "class-validator";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @Optional()
    @IsEnum(Status)
    @ApiPropertyOptional({ enum: Status, example: Status.Delivered })
    status: Status;
}
