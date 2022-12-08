import { Injectable } from '@nestjs/common';
import { CommentsSchema } from './entity/comments.scheme';
import { CommentBDModel } from './entity/commentDB.model';
import { QueryParametersDTO } from '../../../../global-model/query-parameters.dto';
import { giveSkipNumber } from '../../../../helper.functions';

@Injectable()
export class CommentsRepository {
  async getComments(
    query: QueryParametersDTO,
    postId: string,
  ): Promise<CommentBDModel[]> {
    return CommentsSchema.find(
      { postId },
      { _id: false, postId: false, __v: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async getTotalCount(postId: string): Promise<number> {
    return CommentsSchema.countDocuments({ postId });
  }

  async getCommentById(commentId: string): Promise<CommentBDModel | null> {
    const comment = await CommentsSchema.findOne(
      { id: commentId },
      { projection: { _id: false, postId: false, __v: false } },
    );

    if (!comment) {
      return null;
    }

    return comment;
  }

  async createComment(
    newComment: CommentBDModel,
  ): Promise<CommentBDModel | null> {
    try {
      await CommentsSchema.create(newComment);
      return newComment;
    } catch (e) {
      return null;
    }
  }

  async updateComment(commentId: string, comment: string): Promise<boolean> {
    const result = await CommentsSchema.updateOne(
      { id: commentId },
      { $set: { content: comment } },
    );

    return result.modifiedCount === 1;
  }

  async deleteCommentById(commentId: string): Promise<boolean> {
    const result = await CommentsSchema.deleteOne({ id: commentId });

    return result.deletedCount === 1;
  }
}
