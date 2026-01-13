import "./commentItem.scss";
import Avatar from "../../atoms/Avatar";
import Text from "../../atoms/Text";
import LikeIcon from "../../atoms/LikeIcon";
import Button from "../../atoms/Button";

type CommentAuthor = {
  name: string;
  avatar?: string;
};

export type CommentItemProps = {
  author: CommentAuthor;
  content: string;
  timestamp: string;
  likes?: number;
  liked?: boolean;
  nested?: boolean;
  highlighted?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  onAuthorClick?: () => void;
};

const CommentItem = ({
  author,
  content,
  likes = 0,
  liked = false,
  nested = false,
  highlighted = false,
  onLike,
  onReply,
  onAuthorClick,
}: CommentItemProps) => {
  const rootClass =
    `comment-item` +
    (nested ? " comment-item--nested" : "") +
    (highlighted ? " comment-item--highlighted" : "");

  return (
    <article className={rootClass}>
      <Avatar src={author.avatar} alt={author.name} size="sm" />

      <div className="comment-item__body">
        <div className="comment-item__header">
          <button
            type="button"
            className="comment-item__author"
            onClick={onAuthorClick}
          >
            {author.name}
          </button>

        </div>

        <Text>{content}</Text>

        <div className="comment-item__actions">
          <Button variant="outline" size="sm" onClick={onLike}>
            <span className="comment-item__like">
              <LikeIcon liked={liked} />
              {likes > 0 && <span className="comment-item__count">{likes}</span>}
            </span>
          </Button>

          {onReply && (
            <Button variant="secondary" size="sm" onClick={onReply}>
              Reply
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default CommentItem;
