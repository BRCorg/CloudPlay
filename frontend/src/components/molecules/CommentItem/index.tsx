import { useState } from "react";
import type { IComment } from "../../../redux/comments/types";
import "./commentItem.scss";

import Avatar from "../../atoms/Avatar";
import Textarea from "../../atoms/InputTextArea";
import Button from "../../atoms/Button";
import LikeIcon from "../../atoms/LikeIcon";
import Text from "../../atoms/Text";

// Type des props du composant CommentItem
export type CommentItemProps = {
  comment: IComment; // Le commentaire à afficher
  currentUserId?: string; // L'ID de l'utilisateur courant (pour vérifier l'auteur)
  onEdit: (commentId: string, content: string) => void; // Fonction pour éditer le commentaire
  onDelete: (commentId: string) => void; // Fonction pour supprimer le commentaire
  onLike?: (commentId: string) => void; // Fonction pour aimer le commentaire
  onReply?: (commentId: string) => void; // Fonction pour répondre au commentaire (optionnel)
};

// Composant CommentItem pour afficher un commentaire individuel
const CommentItem = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onLike,
}: CommentItemProps) => {
  // État local pour savoir si on est en mode édition (faux par défaut)
  const [isEditing, setIsEditing] = useState(false);

  // État local pour le contenu édité du commentaire
  // Pré-rempli avec le contenu actuel du commentaire
  const [editContent, setEditContent] = useState(comment.content);

  // Vérifie si l'utilisateur courant est l'auteur du commentaire
  const isAuthor = currentUserId === comment.author._id;

  // Vérifie si l'utilisateur courant a liké le commentaire
  const isLiked = currentUserId ? comment.likes.includes(currentUserId) : false;

  // Gestion des actions
  const handleSave = () => {
    // Si le contenu édité n'est pas vide, on appelle la fonction onEdit
    if (editContent.trim()) {
      onEdit(comment._id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Réinitialise le contenu édité et quitte le mode édition
    setEditContent(comment.content);
    setIsEditing(false);
  };

  // Gestion de la suppression du commentaire
  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
      onDelete(comment._id);
    }
  };

  // Fonction utilitaire pour afficher le temps écoulé depuis la création du commentaire
  const timeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    if (seconds < 60) return "à l'instant";
    if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)}h`;
    return `il y a ${Math.floor(seconds / 86400)}j`;
  };

  // ------------------- Rendu du composant -------------------//
  return (
    <div className="comment-item">
      {/* Avatar */}
      <div className="comment-item__avatar">
        <Avatar
          src={
            comment.author.avatar
              ? `http://localhost:5000/uploads/${comment.author.avatar}`
              : undefined
          }
          alt={comment.author.username}
        />
      </div>

      {/* Contenu du commentaire */}
      <div className="comment-item__content">
        <div className="comment-item__header">
          <span className="comment-item__author">
            {comment.author.username}
          </span>
          <span className="comment-item__time">
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Si on est en mode édition, on affiche un textarea pour modifier le commentaire */}
        {isEditing ? (
          <div className="comment-item__edit">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
            />
            <div className="comment-item__edit-actions">
              <Button onClick={handleCancel} variant="secondary" size="sm">
                Annuler
              </Button>
              <Button onClick={handleSave} size="sm">
                Enregistrer
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Text className="comment-item__text">{comment.content}</Text>
            <div className="comment-item__actions">
              {/* Bouton like */}
              <Button
                className={`comment-item__like ${isLiked ? "comment-item__like--active" : ""
                  }`}
                onClick={() => onLike && onLike(comment._id)}
                variant={isLiked ? "primary" : "secondary"}
                size="sm"
                aria-label={isLiked ? "Retirer le like" : "Liker"}
              >
                <LikeIcon liked={isLiked} />
                {comment.likes.length > 0 && (
                  <span>{comment.likes.length}</span>
                )}
              </Button>

              {/* Si c'est l'auteur du commentaire, on affiche les boutons modifier et supprimer */}
              {isAuthor && (
                <>
                  <Button
                    className="comment-item__action-btn"
                    onClick={() => setIsEditing(true)}
                    variant="secondary"
                    size="sm"
                  >
                    Modifier
                  </Button>
                  <Button
                    className="comment-item__action-btn"
                    onClick={handleDelete}
                    variant="outline"
                    size="sm"
                  >
                    Supprimer
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default CommentItem;
