import { Injectable } from '@nestjs/common';
import { LikesScheme } from './entity/likes.scheme';
import { NewestLikesModel } from './entity/newestLikes.model';

@Injectable()
export class LikesRepository {
  async getUserReaction(parentId: string, userId: string) {
    try {
      return LikesScheme.findOne(
        { parentId, userId, isBanned: false },
        { _id: false, parentId: false, userId: false, __v: false },
      ).lean();
    } catch (e) {
      return null;
    }
  }

  async getNewestLikes(parentId: string): Promise<NewestLikesModel[] | null> {
    try {
      return LikesScheme.find(
        { parentId, status: 'Like', isBanned: false },
        { _id: false, parentId: false, status: false, __v: false },
      )
        .sort({ addedAt: -1 })
        .limit(3)
        .lean();
    } catch (e) {
      return null;
    }
  }

  async getLikeReactionsCount(parentId: string): Promise<number> {
    return LikesScheme.countDocuments({ parentId, status: 'Like', isBanned: false });
  }
  async getDislikeReactionsCount(parentId: string): Promise<number> {
    return LikesScheme.countDocuments({ parentId, status: 'Dislike', isBanned: false });
  }

  async updateUserReaction(
    commentId: string,
    userId: string,
    status: string,
    addedAt: string,
    login?: string,
  ): Promise<boolean> {
    try {
      await LikesScheme.updateOne(
        { parentId: commentId, userId, login },
        { $set: { status, addedAt } },
        { upsert: true },
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async updateBanStatus(userId: string, isBanned: boolean) {
    try {
      await LikesScheme.updateOne(
        { userId },
        { $set: { isBanned } },
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
