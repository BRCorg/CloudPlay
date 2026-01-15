import "./postCard.scss";
import Avatar from "../../atoms/Avatar";
import LikeIcon from "../../atoms/LikeIcon";
import Button from "../../atoms/Button";

// Type pour l'auteur du post
type Author = {
  name: string;
  avatar?: string;
};

// Type des props du composant PostCard
export type PostCardProps = {
  title: string; // Titre du post
  content: string; // Contenu du post
  author: Author; // Auteur du post
  image?: string; // URL de l'image du post (optionnel)
  likes?: number; // Nombre de likes
  comments?: number; // Nombre de commentaires
  timestamp?: string; // Date/heure du post (optionnel)
  liked?: boolean; // Si l'utilisateur courant a liké le post
  onToggleLike?: (next: boolean) => void; // Fonction pour toggler le like
  onOpen?: () => void; // Fonction pour ouvrir le post en détail
  isAuthor?: boolean; // Indique si l'utilisateur courant est l'auteur du post
  onEdit?: () => void; // Fonction pour éditer le post
  onDelete?: () => void; // Fonction pour supprimer le post
};

// Composant PostCard pour afficher un post individuel
const PostCard = ({
  title,
  content,
  author,
  image,
  likes = 0,
  comments = 0,
  timestamp,
  liked = false,
  onToggleLike,
  onOpen,
  isAuthor = false,
  onEdit,
  onDelete,
}: PostCardProps) => {
  // Vérifie si on peut liker (si la fonction onToggleLike est fournie)
  const canLike = Boolean(onToggleLike);

  // ------------------- Rendu du composant -------------------//
  return (
    <article className="post-card">
      {/* Zone principale cliquable pour ouvrir le post en détail */}
      <button type="button" className="post-card__main" onClick={onOpen}>
        {/* En-tête : avatar et infos auteur */}
        <header className="post-card__header">
          <Avatar 
            src={author.avatar} 
            alt={author.name} 
            size="md" 
          />
          <div className="post-card__meta">
            <p className="post-card__author">{author.name}</p>
            {/* Date/heure du post si fournie */}
            {timestamp && (
              <span className="post-card__timestamp">{timestamp}</span>
            )}
          </div>
        </header>

        {/* Contenu du post : titre et texte */}
        <div className="post-card__content">
          <h3 className="post-card__title">{title}</h3>
          <p className="post-card__text">{content}</p>
        </div>
      </button>

      {/* Image du post si présente */}
      {image && (
        <img
          className="post-card__image"
          src={image}
          alt={title}
          loading="lazy"
        />
      )}

      {/* Pied de carte : likes, commentaires, actions auteur */}
      <footer className="post-card__footer">
        <div className="post-card__footer-left">
          {/* Seul un utilisateur connecté (onToggleLike fourni) peut liker */}
          {canLike && (
            <span className="post-card__like">
              <LikeIcon liked={liked} onClick={() => onToggleLike?.(!liked)} />
              {/* Affiche le nombre de likes si > 0 */}
              {likes > 0 && <span className="post-card__count">{likes}</span>}
            </span>
          )}

          {/* Nombre de commentaires */}
          <span className="post-card__comments" aria-label="Comments">
            💬 {comments}
          </span>
        </div>

        {/* Actions auteur : modifier et supprimer (si user est l'auteur) */}
        {isAuthor && (
          <div className="post-card__actions">
            {/* Bouton modifier */}
            {onEdit && (
              <Button
                className="post-card__action-btn"
                onClick={(e: React.MouseEvent) => {
                  // Empêche le clic sur ce bouton de remonter et de déclencher l'ouverture du post
                  e.stopPropagation();
                  onEdit();
                }}
                variant="secondary"
                size="sm"
                title="Modifier"
              >
                ✏️
              </Button>
            )}
            {/* Bouton supprimer */}
            {onDelete && (
              <Button
                className="post-card__action-btn post-card__action-btn--delete"
                onClick={(e: React.MouseEvent) => {
                  // Empêche la propagation du clic au bouton principal (ouvrir le post)
                  e.stopPropagation();
                  if (window.confirm("Voulez-vous vraiment supprimer ce post ?")) {
                    onDelete();
                  }
                }}
                variant="outline"
                size="sm"
                title="Supprimer"
              >
                🗑️
              </Button>
            )}
          </div>
        )}
      </footer>
    </article>
  );
};

export default PostCard;
