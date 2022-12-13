import { LikesModel } from "../../../public/likes/infrastructure/entity/likes.model";

export class CommentWithAdditionalInfoModel {
  id: string
  content: string
  createdAt: string
  likeInfo: {
    likesCount: number
    dislikesCount: number
    myStatus: LikesModel,
  }
  commentatorInfo: {
    userId: string
    userLogin: string
  }
  postInfo: {
    id: string
    title: string
    blogId: string
    blogName: string
  }
}