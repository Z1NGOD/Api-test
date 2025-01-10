import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { Controller, HttpStatus, Get, Post, Body, Param, Delete, Query, UseInterceptors, Patch, UseGuards } from "@nestjs/common";
import { ProductService } from "@core/product/services/product.service";
import { CreateProductDto, UpdateProductDto } from "@core/product/dto";
import { SearchProductDto, PaginationDto } from "@core/product/dto";
import { ResponseInterceptor } from "@common/interceptors/response.interceptor";
import { AccessTokenAuthGuard } from "@lib/security/guards";
import { AuthUser } from "@common/decorators";
import { JwtPayload } from "@lib/security/strategies/access-token.strategy";

@ApiTags("Products")
@Controller("products")
@UseInterceptors(ResponseInterceptor)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post("create")
    @UseGuards(AccessTokenAuthGuard)
    @ApiOperation({ summary: "Create a new product" })
    @ApiBody({ type: CreateProductDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The product has been successfully created.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Post("favorite/:id")
    @ApiBearerAuth()
    @UseGuards(AccessTokenAuthGuard)
    @ApiOperation({ summary: "Add a product to favorites" })
    @ApiParam({ name: "id", type: String, description: "Product ID" })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The product has been successfully added in favorites.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    addToFavorites(@Param("id") id: string, @AuthUser() user: JwtPayload) {
        return this.productService.addToFavorites(id, user.sub);
    }

    @Get("all")
    @ApiOperation({ summary: "Get a list of products" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "List of products successfully retrieved.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    async findAll(@Query() search: SearchProductDto, @Query() pagination: PaginationDto) {
        return await this.productService.findAll(search, pagination);
    }

    @Get("detail/:id")
    @ApiOperation({ summary: "Get a product by ID" })
    @ApiParam({ name: "id", type: String, description: "Product ID" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The product has been successfully retrieved.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Product not found.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    findOne(@Param("id") id: string) {
        return this.productService.findOne(id);
    }

    @Get("favorites")
    @ApiOperation({
        summary: "Get a list of products added to favorites by user ID",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "List of products added to favorites successfully retrieved.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Product not found.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    @UseGuards(AccessTokenAuthGuard)
    findFavorites(@AuthUser() user: JwtPayload) {
        return this.productService.findFavorites(user.sub);
    }

    @Patch("edit/:id")
    @ApiOperation({ summary: "Update a product by ID" })
    @ApiParam({ name: "id", type: String, description: "Product ID" })
    @ApiBody({ type: UpdateProductDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The product has been successfully updated.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Product not found.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete("favorite/:id")
    @ApiBearerAuth()
    @UseGuards(AccessTokenAuthGuard)
    @ApiOperation({ summary: "Remove a product from favorites" })
    @ApiParam({ name: "id", type: String, description: "Product ID" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "The product has been successfully removed from favorites.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    removeFromFavorites(@Param("id") id: string, @AuthUser() user: JwtPayload) {
        return this.productService.removeFromFavorites(id, user.sub);
    }

    @Delete("remove/:id")
    @ApiOperation({ summary: "Delete a product by ID" })
    @ApiParam({ name: "id", type: String, description: "Product ID" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The product has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Product not found.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    remove(@Param("id") id: string) {
        return this.productService.remove(id);
    }
}
