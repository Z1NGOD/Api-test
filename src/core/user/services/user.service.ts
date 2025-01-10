import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserRepository } from "src/lib/db/repositoires";
import { CloudinaryService } from "@lib/cloudinary/services/cloudinary.service";
import { ImageRepository } from "@lib/db/repositoires";
import { PasswordService } from "@lib/security/services/password.service";
import { UpdatePasswordDto } from "../dto/update-password.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly imageRepository: ImageRepository,
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}
    async create(createUserDto: CreateUserDto) {
        return await this.userRepository.create(createUserDto);
    }

    async findOne(id: string) {
        return await this.userRepository.findOne(id);
    }

    async findByEmail(email: string) {
        return await this.userRepository.findByEmail(email);
    }

    async findOneByResetToken(token: string) {
        return await this.userRepository.findOneByResetToken(token);
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        let updatedUser = updateUserDto;

        if (updateUserDto.avatar) {
            const response = await this.cloudinaryService.uploadFile(updateUserDto.avatar);
            const image = await this.imageRepository.create(response.public_id, response.url);

            updatedUser = {
                ...updateUserDto,
                avatar: image._id.toString(),
            };
        }

        return await this.userRepository.update(id, updatedUser);
    }

    async updatePassword(userId: string, updatePassword: UpdatePasswordDto) {
        const user = await this.userRepository.findOne(userId);

        if (!user) throw new NotFoundException("User not found");

        const isOldPasswordValid = await this.passwordService.scryptVerify(updatePassword.oldPassword, user.password);

        if (!isOldPasswordValid) throw new BadRequestException("Old password is incorrect");

        if (updatePassword.newPassword !== updatePassword.confirmPassword) throw new BadRequestException("New password and confirm password do not match");

        const hashedNewPassword = await this.passwordService.scryptHash(updatePassword.newPassword);

        return await this.userRepository.update(userId, {
            password: hashedNewPassword,
        });
    }

    async remove(id: string) {
        const user = await this.userRepository.findOne(id);

        if (user.avatar) {
            await this.cloudinaryService.destroyFile(user.avatar.public_id);
            await this.imageRepository.remove(user.avatar.public_id);
        }

        return await this.userRepository.remove(id);
    }
}
