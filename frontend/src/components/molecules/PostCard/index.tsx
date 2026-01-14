import "./postCard.scss";
import Avatar from "../../atoms/Avatar";
import LikeIcon from "../../atoms/LikeIcon";

type Author = {
  name: string;
  avatar?: string;
};

export type PostCardProps = {
  title: string;
  content: string;
  author: Author;
  image?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;

  liked?: boolean;
  onToggleLike?: (next: boolean) => void;

  onOpen?: () => void;
  isAuthor?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

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
  const canLike = Boolean(onToggleLike);

  return (
    <article className="post-card">
      <button type="button" className="post-card__main" onClick={onOpen}>
        <header className="post-card__header">
          <Avatar src={author.avatar} alt={author.name} size="md" />
          <div className="post-card__meta">
            <p className="post-card__author">{author.name}</p>
            {timestamp && <span className="post-card__timestamp">{timestamp}</span>}
          </div>
        </header>

        <div className="post-card__content">
          <h3 className="post-card__title">{title}</h3>
          <p className="post-card__text">{content}</p>
        </div>
      </button>

      {image && (
        <img
          className="post-card__image"
          src={image}
          alt={title}
          loading="lazy"
        />
      )}

      <footer className="post-card__footer">
        <div className="post-card__footer-left">
          {canLike && (
            <span className="post-card__like">
              <LikeIcon liked={liked} onClick={() => onToggleLike?.(!liked)} />
              {likes > 0 && <span className="post-card__count">{likes}</span>}
            </span>
          )}

          <span className="post-card__comments" aria-label="Comments">
            💬 {comments}
          </span>
        </div>

        {isAuthor && (
          <div className="post-card__actions">
            {onEdit && (
              <button
                type="button"
                className="post-card__action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                title="Modifier"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="post-card__action-btn post-card__action-btn--delete"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Voulez-vous vraiment supprimer ce post ?")) {
                    onDelete();
                  }
                }}
                title="Supprimer"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </footer>
    </article>
  );
};

export default PostCard;