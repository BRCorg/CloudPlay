import type { IComment } from "../../../redux/comments/types";
import CommentItem from "../../molecules/CommentItem";
import "./commentList.scss";

// Type des props du composant CommentList
export type CommentListProps = {
  comments: IComment[];
  currentUserId?: string;
  editingCommentId?: string | null;
  onEdit: (commentId: string) => void; // Active le mode édition
  onCancelEdit: () => void;
  onSaveEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
};

// Composant CommentList pour afficher une liste de commentaires
const CommentList = ({ comments, currentUserId, editingCommentId, onEdit, onCancelEdit, onSaveEdit, onDelete, onLike }: CommentListProps) => {

  // Si la liste des commentaires est vide, on affiche un message
  if (comments.length === 0) {
    return (
      <div className="comment-list comment-list--empty">
        <p className="comment-list__empty-text">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
      </div>
    );
  }


  // ------------------- Rendu du composant -------------------//
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUserId={currentUserId}
          isEditing={editingCommentId === comment._id}
          onEdit={editingCommentId === comment._id
            ? (commentId: string, content?: string) => onSaveEdit(commentId, content ?? "")
            : onEdit}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default CommentList;