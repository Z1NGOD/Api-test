import { ImageRepository, UserRepository } from "@lib/db/repositoires";
import { BadRequestException, Injectable } from "@nestjs/common";
import { GoogleUserDto } from "../dto/google-user.dto";
import { Roles } from "@common/enums";
import { CloudinaryService } from "@lib/cloudinary/services/cloudinary.service";
import { EmailQueueService } from "@lib/mail/services";

@Injectable()
export class OAuth2Service {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly imageRepository: ImageRepository,
        private readonly emailQueueService: EmailQueueService,
    ) {}

    async validateGoogleUser(googleUser: GoogleUserDto) {
        const user = await this.userRepository.findByEmail(googleUser.email);
        if (user) return user;

        const upload = await this.cloudinaryService.uploadFile(googleUser.photo);
        if (!upload) throw new BadRequestException("Could not upload avatar");

        const avatar = await this.imageRepository.create(upload.public_id, upload.url);
        if (!avatar) throw new BadRequestException("Could not create avatar");

        const newUser = await this.userRepository.create({
            ...googleUser,
            avatar: avatar._id.toString(),
            role: Roles.User,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        await this.emailQueueService.addEmailJob(newUser.email, "Welcome to Our Platform!", "welcome", { username: newUser.name });
        return newUser;
    }
}
