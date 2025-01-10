import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { LoginDto } from "../dto";
import { UserService } from "@core/user/services";
import { CreateUserDto } from "@core/user/dto";
import { PasswordService, TokenService } from "@lib/security/services";
import { RequestUser } from "../interfaces";
import { UserAlreadyExistsException } from "@common/exeptions";
import { randomBytes, createHash } from "crypto";
import { EmailQueueService, MailService } from "@lib/mail/services";
import { CartService } from "@core/cart/services/cart.service";
import { Response } from "express";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService,
        private readonly mailService: MailService,
        private readonly cartService: CartService,
        private readonly emailQueueService: EmailQueueService,
    ) {}

    async registration(userDto: CreateUserDto) {
        if (!userDto) {
            throw new BadRequestException("User data is required");
        }
        if (await this.userService.findByEmail(userDto.email.toLowerCase())) {
            throw new UserAlreadyExistsException("User already exists");
        }
        const hashPassword = await this.passwordService.scryptHash(userDto.password);
        const user = await this.userService.create({
            ...userDto,
            email: userDto.email.toLowerCase(),
            password: hashPassword,
        });

        if (!(await this.cartService.create({ user_id: user._id.toString() }))) {
            await this.userService.remove(user._id.toString());
            throw new BadRequestException("Could not create cart");
        }

        const payload = { sub: user._id, email: user.email };
        const tokens = await this.createTokens(payload);

        const job = await this.emailQueueService.addEmailJob(user.email, "Welcome to Our Platform!", "welcome", { username: user.name });
        console.log(job);

        return { user, ...tokens };
    }

    async login(userDto: LoginDto) {
        if (!userDto) {
            throw new BadRequestException("No user data");
        }

        const user = await this.userService.findByEmail(userDto.email.toLowerCase());
        if (!user) {
            throw new BadRequestException("User not found");
        }

        const isPasswordCorrect = await this.passwordService.scryptVerify(userDto.password, user.password);
        if (!isPasswordCorrect) {
            throw new BadRequestException("Wrong password");
        }

        const payload = { sub: user._id, email: user.email };
        const tokens = await this.createTokens(payload);

        return { user, ...tokens };
    }

    async googleLogin(user, res: Response) {
        const payload = { sub: user._id, email: user.email };
        const tokens = await this.createTokens(payload);

        return res.redirect(`http://localhost:8000?token=${tokens.accessToken}`);
    }

    async forgotPassword(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException(`User with email ${email} not found`);

        const generateToken = randomBytes(32).toString("hex");
        const resetToken = createHash("sha256").update(generateToken).digest("hex");

        (user.resetPasswordToken = resetToken),
            (user.resetPasswordExpires = new Date(Date.now() + 3600000)),
            await this.userService.update(user.id, {
                resetPasswordToken: resetToken,
                resetPasswordExpires: new Date(Date.now() + 3600000),
            });

        await this.mailService.onSendForgotPassword(user, resetToken);
        return user;
    }

    async resetPassword(resetToken: string, password: string) {
        const user = await this.userService.findOneByResetToken(resetToken);

        const hashPassword = await this.passwordService.scryptHash(password);

        await this.userService.update(user.id, {
            password: hashPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        return user;
    }

    async updateAccessToken(refreshToken: string, user: RequestUser) {
        if (!refreshToken) {
            throw new BadRequestException("No refresh token");
        }
        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.tokenService.createAccessToken(payload);

        return { accessToken };
    }

    private async createTokens<T>(payload: { sub: T; email?: string }) {
        const accessToken = await this.tokenService.createAccessToken(payload);
        const refreshToken = await this.tokenService.createRefreshToken(payload);

        return { accessToken, refreshToken };
    }
}
