import type { IComment } from "../../../redux/comments/types";
import CommentItem from "../../molecules/CommentItem";
import "./commentList.scss";

export type CommentListProps = {
  comments: IComment[];
  currentUserId?: string;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
};

const CommentList = ({ comments, currentUserId, onEdit, onDelete, onLike }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="comment-list comment-list--empty">
        <p className="comment-list__empty-text">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default CommentList;