import { Controller, Post, Body, UseGuards, Get, HttpStatus, Query, Patch, Delete, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from "@nestjs/swagger";
import { OrderService } from "../services";
import { CreateOrderDto, UpdateOrderDto } from "../dto";
import { AccessTokenAuthGuard } from "@lib/security/guards";
import { AuthUser } from "@common/decorators";
import { JwtPayload } from "@lib/security/strategies/access-token.strategy";
import { ResponseInterceptor } from "@common/interceptors/response.interceptor";
import { SearchOrderDto } from "../dto/search-order.dto";

@Controller("orders")
@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(AccessTokenAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post("create")
    @ApiOperation({ summary: "Create a new order" })
    @ApiBody({ type: CreateOrderDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The order has been successfully created.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    create(@AuthUser() user: JwtPayload, @Body() createOrderDto: CreateOrderDto) {
        return this.orderService.create(user.sub, createOrderDto);
    }

    @Get("all")
    @ApiOperation({ summary: "Get all orders" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The orders have been successfully retrieved.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    findAll(@AuthUser() user: JwtPayload, @Query() data: SearchOrderDto) {
        return this.orderService.findAll(user.sub, data);
    }

    @Get("admin/all")
    @ApiOperation({ summary: "Get all orders (Admin)" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The orders have been successfully retrieved.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    findAllAdmin(@AuthUser() user: JwtPayload, @Query() data: SearchOrderDto) {
        return this.orderService.findAllAdmin(user.sub, data);
    }


    @Get("by-id")
    @ApiOperation({ summary: "Get an order by ID" })
    @ApiQuery({ name: "id", type: String, description: "Order ID" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The order has been successfully retrieved.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Order not found.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    findOne(@AuthUser() user: JwtPayload, @Query("id") id: string) {
        return this.orderService.findOne(user.sub, id);
    }

    @Patch("edit")
    @ApiOperation({ summary: "Update an order by ID" })
    @ApiQuery({ name: "id", type: String, description: "Order ID" })
    @ApiBody({ type: UpdateOrderDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The order has been successfully updated.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    update(@AuthUser() user: JwtPayload, @Query("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.orderService.update(user.sub, id, updateOrderDto);
    }

    @Delete("remove")
    @ApiOperation({ summary: "Delete an order by ID" })
    @ApiQuery({ name: "id", type: String, description: "Order ID" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The order has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Order not found.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    remove(@AuthUser() user: JwtPayload, @Query("id") id: string) {
        return this.orderService.remove(user.sub, id);
    }
}
