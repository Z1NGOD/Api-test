import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";

import { ResponseInterceptor } from "@common/interceptors/response.interceptor";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto";
import { AccessTokenAuthGuard } from "@lib/security/guards";
import { SearchCategoryDto } from "../dto/search-category.dto";

@Controller("categories")
@ApiTags("Categories")
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post("create")
    @UseGuards(AccessTokenAuthGuard)
    @ApiOperation({ summary: "Create a new category" })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The category has been successfully created.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    async create(@Body() category: CreateCategoryDto) {
        return this.categoryService.create(category);
    }

    @Get("all")
    @ApiOperation({ summary: "Get all categories" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The categories have been successfully retrieved.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    async findAll(@Query() search: SearchCategoryDto) {
        return this.categoryService.findAll(search);
    }

    @Get("detail/:id")
    @ApiOperation({ summary: "Get a category by ID" })
    @ApiParam({ name: "id", type: String, description: "Category ID" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The category has been successfully retrieved.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Category not found.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    async findOne(@Param("id") id: string) {
        return this.categoryService.findOne(id);
    }

    @Get("s/:slug")
    @ApiOperation({ summary: "Get a category by slug" })
    @ApiParam({ name: "slug", type: String, description: "Category slug" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The category has been successfully retrieved.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Category not found.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    async findBySlug(@Param("slug") slug: string) {
        return this.categoryService.findBySlug(slug);
    }

    @Patch("edit/:id")
    @UseGuards(AccessTokenAuthGuard)
    @ApiOperation({ summary: "Update a category by ID" })
    @ApiParam({ name: "id", type: String, description: "Category ID" })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The category has been successfully updated.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    async update(@Param("id") id: string, @Body() data: UpdateCategoryDto) {
        return this.categoryService.update(id, data);
    }

    @Delete("remove/:id")
    @UseGuards(AccessTokenAuthGuard)
    @ApiOperation({ summary: "Delete a category by ID" })
    @ApiParam({ name: "id", type: String, description: "Category ID" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The category has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Category not found.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    async delete(@Param("id") id: string) {
        return this.categoryService.remove(id);
    }
}
