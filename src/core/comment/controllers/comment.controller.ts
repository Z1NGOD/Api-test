import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { CommentService } from "../services";
import { ApiBody, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from "@nestjs/swagger";
import { CommentCreateDto, UpdateCommentDto, QueryDto } from "../dto";
import { ResponseInterceptor } from "@common/interceptors/response.interceptor";
import { JwtPayload } from "@lib/security/strategies/access-token.strategy";
import { AuthUser } from "@common/decorators/auth-user.decorator";
import { AccessTokenAuthGuard } from "@lib/security/guards";

@ApiTags("Comments")
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@Controller("comments")
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post("create")
    @UseGuards(AccessTokenAuthGuard)
    @ApiOperation({ summary: "Create a new comment" })
    @ApiBody({ type: CommentCreateDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The comment has been successfully created.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    create(@Body() data: CommentCreateDto, @AuthUser() user: JwtPayload) {
        return this.commentService.create(data, user);
    }

    @Get("all")
    @UseGuards(AccessTokenAuthGuard)
    @ApiOperation({ summary: "Get all comments" })
    @ApiQuery({ name: "product", required: true, description: "Product ID" })
    @ApiQuery({
        name: "page",
        required: false,
        description: "Pagination: page number",
    })
    @ApiQuery({
        name: "limit",
        required: false,
        description: "Pagination: items per page",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The comments have been successfully retrieved.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "You are not allowed to see comments.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    getAll(@Query() query: QueryDto, @AuthUser() user: JwtPayload) {
        return this.commentService.findAll(query, user);
    }

    @Patch("edit/:id")
    @UseGuards(AccessTokenAuthGuard)
    @ApiOperation({ summary: "Update a comment by ID" })
    @ApiBody({ type: UpdateCommentDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The comment has been successfully updated.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Comment not found.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    update(@Param("id") commentId: string, @Body() data: UpdateCommentDto) {
        return this.commentService.update(commentId, data);
    }

    @Delete("remove/:id")
    @UseGuards(AccessTokenAuthGuard)
    @ApiOperation({ summary: "Delete a comment by ID" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The comment has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Comment not found.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "You are not allowed to delete this comment.",
    })
    remove(@Param("id") commentId: string, @AuthUser() user: JwtPayload) {
        return this.commentService.remove(commentId, user);
    }
}
