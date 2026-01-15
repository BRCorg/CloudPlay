import React, { useState } from "react";
import "./commentSection.scss";

import Avatar from "../../atoms/Avatar";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";
import Textarea from "../../atoms/InputTextArea";
import Spinner from "../../atoms/Spinner";

import CommentItem from "../../molecules/CommentItem";
import type { IComment } from "../../../redux/comments/types";


// Type des props du composant CommentSection
type CommentSectionProps = {
  comments: IComment[];
  user?: { _id: string; username: string; avatar?: string };
  loading?: boolean;
  onAdd: (content: string) => void;
  onLike?: (id: string) => void;
  onReply?: (id: string) => void;
};


// Composant CommentSection pour afficher une section de commentaires
const CommentSection = ({
  comments,
  user,
  loading = false,
  onAdd,
  onLike,
  onReply,
}: CommentSectionProps) => {

  // État local pour le contenu du nouveau commentaire
  // Par défaut, le champ est vide
  const [value, setValue] = useState("");

  // Vérifie si on peut poster le commentaire
  const canPost = value.trim().length > 0 && !loading;

  // Gestion de la soumission du formulaire de commentaire
  const handleSubmit = (e: React.FormEvent) => {

    // Empeche chargement de la page
    e.preventDefault();
    // Si on ne peut pas poster, on arrête
    if (!canPost) return;
    // Appelle la fonction onAdd passée en props
    onAdd(value.trim());
    setValue("");
  };


  // ------------------- Rendu du composant -------------------//
  return (
    <section className="comment-section">
      {/* En-tête de la section : titre et nombre de commentaires */}
      <header className="comment-section__header">
        <h3 className="comment-section__title">
          Commentaires <span className="comment-section__count">({comments.length})</span>
        </h3>
      </header>

      {/* Formulaire d'ajout de commentaire (visible si user connecté) */}
      {user && (
        <form className="comment-section__form" onSubmit={handleSubmit}>
          <Avatar src={user.avatar} alt={user.username} size="sm" />

          <div className="comment-section__form-body">
            <Textarea
              placeholder="Écrire un commentaire..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
              required
            />

            <div className="comment-section__form-actions">
              <Button type="submit" disabled={!canPost}>
                Publier
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Affiche un spinner de chargement si loading est true */}
      {loading && (
        <div className="comment-section__loading" role="status">
          <Spinner size="md" />
          <Text muted>Chargement des commentaires...</Text>
        </div>
      )}

      {/* Affiche un message si aucun commentaire et pas de chargement */}
      {!loading && comments.length === 0 && (
        <div className="comment-section__empty">
          <div className="comment-section__empty-icon">💬</div>
          <p className="comment-section__empty-title">Aucun commentaire pour l'instant</p>
          <Text muted>Soyez le premier à partager votre avis !</Text>
        </div>
      )}

      {/* Affiche la liste des commentaires si présents et pas de chargement */}
      {!loading && comments.length > 0 && (
        <div className="comment-section__list">
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              onEdit={() => {}}
              onDelete={() => {}}
              onLike={onLike ? () => onLike(c._id) : undefined}
              onReply={onReply ? () => onReply(c._id) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;