import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, User, UserDocument } from "../models";
import { Model } from "mongoose";
import { CreateUserDto, UpdateUserDto } from "@core/user/dto";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private readonly UserModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        return await this.UserModel.create(createUserDto);
    }

    async addToFavorites(userId: string, productId: string): Promise<UserDocument> {
        return await this.UserModel.findByIdAndUpdate(userId, {
            $addToSet: { favorites: productId },
        });
    }

    async findOne(id: string): Promise<UserDocument> {
        return await this.UserModel.findById(id).populate("avatar");
    }

    async findByEmail(email: string): Promise<UserDocument> {
        return await this.UserModel.findOne({ email });
    }

    async findOneByResetToken(token: string): Promise<UserDocument> {
        return await this.UserModel.findOne({ resetPasswordToken: token });
    }

    async findToFavorites(userId: string): Promise<Product[]> {
        const user = await this.UserModel.findById(userId)
            .select("favorites")
            .populate("favorites")
            .populate({
                path: "favorites",
                populate: { path: "images" },
            });

        return user.favorites;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        return await this.UserModel.findOneAndUpdate({ _id: id }, updateUserDto).populate("avatar");
    }

    async removeFromFavorites(userId: string, productId: string): Promise<UserDocument> {
        return await this.UserModel.findByIdAndUpdate(userId, {
            $pull: { favorites: productId },
        });
    }

    async remove(id: string): Promise<void> {
        return await this.UserModel.findByIdAndDelete({ _id: id });
    }
}
