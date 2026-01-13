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

        {image && <img className="post-card__image" src={image} alt={title} />}
      </button>

      <footer className="post-card__footer">
        {canLike && (
          <span className="post-card__like">
            <LikeIcon liked={liked} onClick={() => onToggleLike?.(!liked)} />
            {likes > 0 && <span className="post-card__count">{likes}</span>}
          </span>
        )}

        <span className="post-card__comments" aria-label="Comments">
          💬 {comments}
        </span>
      </footer>
    </article>
  );
};

export default PostCard;
