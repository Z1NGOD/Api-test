import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { Controller, Get, Post, Body, Param, Delete, HttpStatus, UseInterceptors, Patch, UseGuards } from "@nestjs/common";
import { UserService } from "../services";
import { CreateUserDto, UpdateUserDto } from "../dto";
import { ResponseInterceptor } from "@common/interceptors/response.interceptor";
import { AuthUser } from "@common/decorators";
import { JwtPayload } from "@lib/security/strategies/access-token.strategy";
import { AccessTokenAuthGuard } from "@lib/security/guards";
import { UpdatePasswordDto } from "../dto/update-password.dto";

@ApiTags("Users")
@Controller("users")
@UseInterceptors(ResponseInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("create")
    @ApiBody({ type: CreateUserDto })
    @ApiOperation({ summary: "Create a new user" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request." })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The user has been successfully created.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get("account")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get an own account " })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found." })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The user has been successfully retrieved.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    @UseGuards(AccessTokenAuthGuard)
    async findAccount(@AuthUser() user: JwtPayload) {
        return this.userService.findOne(user.sub);
    }

    @Get("detail/:id")
    @ApiOperation({ summary: "Get a user by ID" })
    @ApiParam({ name: "id", type: String, description: "User ID" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found." })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The user has been successfully retrieved.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    async findOne(@Param("id") id: string) {
        return this.userService.findOne(id);
    }

    @Patch("edit")
    @ApiBody({ type: UpdateUserDto })
    @ApiOperation({ summary: "Update a user by ID" })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Product not found.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The product has been successfully updated.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    @UseGuards(AccessTokenAuthGuard)
    async update(@AuthUser() user: JwtPayload, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(user.sub, updateUserDto);
    }

    @Patch("edit/security")
    @ApiOperation({ summary: "Update a user password" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found." })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The password has been successfully updated.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    @UseGuards(AccessTokenAuthGuard)
    async updatePassword(@AuthUser() user: JwtPayload, @Body() updatePasswordDto: UpdatePasswordDto) {
        return this.userService.updatePassword(user.sub, updatePasswordDto);
    }

    @Delete("remove/:id")
    @ApiOperation({ summary: "Delete a user by ID" })
    @ApiParam({ name: "id", type: String, description: "User ID" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found." })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The user has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Internal Server Error.",
    })
    async remove(@Param("id") id: string) {
        return this.userService.remove(id);
    }
}
