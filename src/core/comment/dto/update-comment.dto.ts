import { PartialType } from "@nestjs/swagger";
import { CommentCreateDto } from "./create-comment.dto";

export class UpdateCommentDto extends PartialType(CommentCreateDto) {}
