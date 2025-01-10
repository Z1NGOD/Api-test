import { Module } from "@nestjs/common";
import { CommentController } from "./controllers/comment.controller";
import { CommentService } from "./services";
import { CommentRepository } from "@lib/db/repositoires/comment.repository";
import { ProductRepository } from "@lib/db/repositoires";
import { UserRepository } from "@lib/db/repositoires";
import { DbModule } from "@lib/db";

@Module({
    imports: [DbModule],
    controllers: [CommentController],
    providers: [CommentService, CommentRepository, UserRepository, ProductRepository],
    exports: [CommentService, CommentRepository, UserRepository, ProductRepository],
})
export class CommentModule {}
