import { Controller, UseInterceptors, Get, Post, Body, Patch, Delete, UseGuards, HttpStatus } from "@nestjs/common";
import { CartService } from "../services/cart.service";
import { ApiBody, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateCartDto, DeleteProductFromCart, UpdateCartDto, UpdateProductInCart } from "../dto";
import { AuthUser } from "@common/decorators";
import { AccessTokenAuthGuard } from "@lib/security/guards";
import { JwtPayload } from "@lib/security/strategies/access-token.strategy";
import { ResponseInterceptor } from "@common/interceptors/response.interceptor";

@Controller("carts")
@ApiTags("Carts")
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@UseGuards(AccessTokenAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post("create")
    @ApiOperation({ summary: "Create a new cart for the authenticated user" })
    @ApiBody({ type: CreateCartDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Cart has been successfully created.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    create(@Body() createCartDto: CreateCartDto) {
        return this.cartService.create(createCartDto);
    }

    @Post("add")
    @ApiOperation({ summary: "Add a product to the cart" })
    @ApiBody({ type: UpdateCartDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Product added to the cart successfully.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    add(@AuthUser() user: JwtPayload, @Body() updateCartDto: UpdateCartDto) {
        return this.cartService.add(user.sub, updateCartDto);
    }

    @Get("by-user")
    @ApiOperation({ summary: "Retrieve the cart for the authenticated user" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Cart retrieved successfully.",
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Cart not found." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    findByUserId(@AuthUser() user: JwtPayload) {
        return this.cartService.findByUserId(user.sub);
    }

    @Patch("edit")
    @ApiOperation({ summary: "Update a product in the cart" })
    @ApiBody({ type: UpdateProductInCart })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Cart updated successfully.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    update(@AuthUser() user: JwtPayload, @Body() updateCartDto: UpdateProductInCart) {
        return this.cartService.update(user.sub, updateCartDto);
    }

    @Delete("clear")
    @ApiOperation({ summary: "Clear the cart" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Cart cleared successfully.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    clear(@AuthUser() user: JwtPayload) {
        return this.cartService.clear(user.sub);
    }

    @Delete("remove")
    @ApiOperation({ summary: "Delete the cart" })
    @ApiBody({ type: DeleteProductFromCart })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Product removed from the cart successfully.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Product not found.",
    })
    remove(@AuthUser() user: JwtPayload, @Body() deleteProductFromCart: DeleteProductFromCart) {
        return this.cartService.remove(user.sub, deleteProductFromCart.productId);
    }
}
