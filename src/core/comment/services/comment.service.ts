import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CommentRepository } from "@lib/db/repositoires/comment.repository";
import { ProductRepository } from "@lib/db/repositoires";
import { CommentCreateDto, UpdateCommentDto, QueryDto } from "../dto";
import { Roles } from "@common/enums";
import { JwtPayload } from "@lib/security/strategies/access-token.strategy";
import { UserRepository } from "@lib/db/repositoires/user.repository";
import { UserDocument } from "@lib/db/models";

@Injectable()
export class CommentService {
    constructor(private readonly commentsRepository: CommentRepository, private readonly productRepository: ProductRepository, private readonly userRepository: UserRepository) {}

    async create(data: CommentCreateDto, user: JwtPayload) {
        const product: string = data.product;
        const hasProduct = await this.productRepository.findOne(product);

        if (!hasProduct) {
            throw new NotFoundException("Product not found");
        }

        const parent: string = data.parent;
        let parentComment = null;

        if (parent) {
            parentComment = await this.commentsRepository.findOne(parent);
            if (!parentComment || parentComment.product.toString() !== hasProduct._id.toString()) {
                throw new NotFoundException("Reply comment not found");
            }
        }

        const comment = await this.commentsRepository.create({
            product,
            parent,
            rating: data.rating,
            text: data.text,
            user: user.sub,
        });

        return comment;
    }

    async findAll(query: QueryDto, user: JwtPayload) {
        const findUser = await this.userRepository.findOne(user.sub);
        const product = query.product;

        const page: number = Number(query.page) || 1;
        let limit: number = Number(query.limit) || 10;

        if (limit > 10) limit = 10;
        if (!product) {
            if (findUser && findUser.role != Roles.Admin) {
                throw new ForbiddenException("You are not allowed to see comments");
            }
            return await this.commentsRepository.findAll(limit, page);
        }

        return await this.commentsRepository.findByProductId(product, page, limit);
    }

    async update(id: string, data: UpdateCommentDto) {
        const comment = await this.commentsRepository.findOne(id);

        if (!comment) {
            throw new NotFoundException("Comment not found");
        }

        return await this.commentsRepository.updateOne(id, data);
    }

    async remove(id: string, user: JwtPayload) {
        const comment = await this.commentsRepository.findOne(id);
        const findUser = await this.userRepository.findOne(user.sub);
        const commentUser = comment.user as UserDocument;

        if (!comment) {
            throw new NotFoundException("Comment not found");
        }

        if (commentUser._id.toString() !== user.sub && !findUser.role.includes(Roles.Admin)) {
            throw new ForbiddenException("You are not allowed to delete this comment");
        }

        if (comment.replies && comment.replies.length > 0) {
            await Promise.all(
                comment.replies.map(async (replyId) => {
                    await this.remove(replyId.toString(), user);
                })
            );
        }

        await this.commentsRepository.removeOne(id);
    }
}
