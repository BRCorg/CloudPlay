import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { createComment } from "../../../redux/comments/commentsSlice";
import { getFieldError } from "../../../utils/getFieldError";
import "./commentForm.scss";

import Avatar from "../../atoms/Avatar";
import Textarea from "../../atoms/InputTextArea";
import Button from "../../atoms/Button";

// Type pour l'utilisateur courant
type CurrentUser = {
  name: string;
  avatar?: string;
};

// Type des props du composant CommentForm
export type CommentFormProps = {
  postId: string;
  user?: CurrentUser;
};

const CommentForm = ({ postId, user }: CommentFormProps) => {
  // On récupère le dispatch pour envoyer des actions au store Redux
  const dispatch = useAppDispatch();

  // État local pour le contenu du commentaire
  const [content, setContent] = useState("");

  // Récupération des erreurs depuis le store Redux
  const error = useAppSelector((state) => state.comments.error);
  const contentError = getFieldError(error, "content");

  // On peut soumettre si le contenu n'est pas vide après suppression des espaces
  const canSubmit = content.trim().length > 0;

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    // Empêcher le comportement par défaut du formulaire
    // (rechargement de la page)
    e.preventDefault();

    // Si on ne peut pas soumettre, on arrête
    if (!canSubmit) return;

    // Dispatch de l'action pour créer un commentaire
    await dispatch(
      createComment({
        postId,
        content: content.trim(),
      })
    );

    // Réinitialisation du contenu du commentaire
    setContent("");
  };

  // ------------------- Rendu du composant -------------------//
  return (
    <form className="comment-form" onSubmit={handleSubmit}>

    {/* Si user est connecté, on affiche son avatar */}
      {user && (
        <div className="comment-form__header">
          <Avatar src={user.avatar} alt={user.name} size="sm" />
        </div>
      )}

      <div className="comment-form__content">
        <Textarea
          placeholder="Ajouter un commentaire..."
          value={content}
          onChange={(e) => setContent(e.target.value)} // Met à jour le contenu
          rows={2}
          required
        />

        {/* Affichage des erreurs liées au contenu */}
        {contentError && (
          <p className="comment-form__error" role="alert">
            {contentError}
          </p>
        )}

        {/* On disable le bouton si c'est vide */}
        <Button type="submit" disabled={!canSubmit} size="sm">
          Commenter
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
