export interface IComment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  post: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentState {
  comments: IComment[];
  loading: boolean;
  error: string | null;
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
}

export interface UpdateCommentPayload {
  commentId: string;
  content: string;
}
