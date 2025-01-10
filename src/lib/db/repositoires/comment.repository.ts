import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "../models/comment.schema";
import { CommentCreateDto, UpdateCommentDto } from "@core/comment/dto";
import mongoose, { Model } from "mongoose";
import { ProductRepository } from "./product.repository";

@Injectable()
export class CommentRepository {
    constructor(@InjectModel(Comment.name) private readonly commentModel: Model<Comment>, private readonly productRepository: ProductRepository) {}

    async create(data: CommentCreateDto): Promise<CommentDocument> {
        const parentComment = data.parent ? await this.commentModel.findById(data.parent).exec() : null;

        const comment = await this.commentModel.create({
            ...data,
        });

        if (parentComment) await this.updateRepliesToComment(parentComment._id.toString(), comment._id.toString());

        if (data.rating !== undefined) {
            await this.updateProductRating(data.product);
        }

        return await comment.populate({
            path: "user",
            populate: { path: "avatar" },
        });
    }

    async findAll(limit: number, page: number): Promise<CommentDocument[]> {
        const skip = (page - 1) * limit;

        return await this.commentModel
            .aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: "replies",
                        foreignField: "_id",
                        as: "replies",
                    },
                },
                {
                    $lookup: {
                        from: "user",
                        localField: "user.avatar",
                        foreignField: "_id",
                        as: "user.avatar",
                    },
                },
                {
                    $addFields: {
                        user: { $arrayElemAt: ["$user", 0] },
                        product: { $arrayElemAt: ["$product", 0] },
                    },
                },
                { $skip: skip },
                { $limit: limit },
                { $sort: { createdAt: -1 } },
            ])
            .exec();
    }

    async findOne(id: string): Promise<CommentDocument> {
        return await this.commentModel.findById(id).populate("user", "product");
    }

    async findByProductId(product: string, page: number, limit: number): Promise<CommentDocument[]> {
        const skip = (page - 1) * limit;

        return await this.commentModel
            .aggregate([
                {
                    $match: { product: new mongoose.Types.ObjectId(product) },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $addFields: {
                        user: { $arrayElemAt: ["$user", 0] },
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: "replies",
                        foreignField: "_id",
                        as: "replies",
                    },
                },
                {
                    $unwind: {
                        path: "$replies",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "replies.user",
                        foreignField: "_id",
                        as: "replies.user",
                    },
                },
                {
                    $addFields: {
                        "replies.user": { $arrayElemAt: ["$replies.user", 0] },
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        doc: { $first: "$$ROOT" },
                        replies: { $push: "$replies" },
                    },
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: ["$doc", { replies: "$replies" }],
                        },
                    },
                },
                {
                    $addFields: {
                        replies: {
                            $filter: {
                                input: "$replies",
                                as: "reply",
                                cond: { $ne: ["$$reply", {}] },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "images",
                        localField: "user.avatar",
                        foreignField: "_id",
                        as: "user.avatar",
                    },
                },
                {
                    $addFields: {
                        "user.avatar": { $arrayElemAt: ["$user.avatar", 0] },
                    },
                },
                { $skip: skip },
                { $limit: limit },
                { $sort: { createdAt: -1 } },
            ])
            .exec();
    }

    async updateOne(id: string, data: UpdateCommentDto): Promise<CommentDocument> {
        return await this.commentModel.findByIdAndUpdate(id, data).populate({
            path: "user",
            populate: { path: "avatar" },
        });
    }

    private async updateProductRating(productId: string): Promise<void> {
        const comments = await this.commentModel.find({ product: productId });

        const totalRating = comments.reduce((sum, comment) => {
            if (typeof comment.rating === "number" && !isNaN(comment.rating)) {
                return sum + comment.rating;
            }
            return sum;
        }, 0);

        const validRatingsCount = comments.filter(comment => typeof comment.rating === "number" && !isNaN(comment.rating)).length;
        const averageRating = validRatingsCount > 0 ? totalRating / validRatingsCount : 0;

        await this.productRepository.updateRating(productId, averageRating);
    }

    private async updateRepliesToComment(parentId: string, childId: string): Promise<void> {
        await this.commentModel.findByIdAndUpdate(parentId, {
            $push: { replies: childId },
        });
    }

    async removeOne(id: string): Promise<void> {
        const comment = await this.commentModel.findById(id);
        if (!comment) throw new NotFoundException("Comment not found");

        if (comment.replies.length > 0) {
            await Promise.all(
                comment.replies.map(reply => {
                    this.removeCommentsByProductId(reply.toString());
                }),
            );
        }

        await this.commentModel.findByIdAndDelete(id);

        if (comment.rating) {
            await this.updateProductRating(comment.product.toString());
        }
    }

    async removeCommentsByProductId(productId: string): Promise<void> {
        await this.commentModel.deleteMany({ productId });
    }
}
