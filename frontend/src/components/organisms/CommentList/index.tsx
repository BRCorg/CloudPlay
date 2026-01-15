import type { IComment } from "../../../redux/comments/types";
import CommentItem from "../../molecules/CommentItem";
import "./commentList.scss";

// Type des props du composant CommentList
export type CommentListProps = {
  comments: IComment[]; // Liste des commentaires à afficher
  currentUserId?: string; // ID de l'utilisateur courant (pour vérifier l'auteur)
  onEdit: (commentId: string, content: string) => void; // Fonction pour éditer un commentaire (void car pas asynchrone)
  onDelete: (commentId: string) => void; // Fonction pour supprimer un commentaire
  onLike: (commentId: string) => void; // Fonction pour aimer un commentaire
};

// Composant CommentList pour afficher une liste de commentaires
const CommentList = ({ comments, currentUserId, onEdit, onDelete, onLike }: CommentListProps) => {

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
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default CommentList;