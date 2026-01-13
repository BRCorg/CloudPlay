import React from 'react';
import { Avatar } from '../../atoms/Avatar';
import { Text } from '../../atoms/Text';
import { LikeIcon } from '../../atoms/LikeIcon';
import { Button } from '../../atoms/Button';
import './commentItem.scss';

export interface CommentItemProps {
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes?: number;
  isLiked?: boolean;
  isNested?: boolean;
  isHighlighted?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  onAuthorClick?: () => void;
  className?: string;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  author,
  content,
  timestamp,
  likes = 0,
  isLiked = false,
  isNested = false,
  isHighlighted = false,
  onLike,
  onReply,
  onAuthorClick,
  className = '',
}) => {
  const classes = [
    'comment-item',
    isNested && 'comment-item--nested',
    isHighlighted && 'comment-item--highlighted',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="comment-item__avatar">
        <Avatar
          src={author.avatar}
          alt={author.name}
          fallback={author.name.charAt(0).toUpperCase()}
          size="small"
        />
      </div>

      <div className="comment-item__content">
        <div className="comment-item__header">
          <Text
            as="span"
            weight="semibold"
            className="comment-item__author"
            onClick={onAuthorClick}
          >
            {author.name}
          </Text>
          <Text as="span" size="sm" color="muted" className="comment-item__timestamp">
            {timestamp}
          </Text>
        </div>

        <Text className="comment-item__text">{content}</Text>

        <div className="comment-item__actions">
          <Button
            variant="ghost"
            size="small"
            className={`comment-item__action ${isLiked ? 'comment-item__action--active' : ''}`}
            onClick={onLike}
          >
            <LikeIcon liked={isLiked} size="small" />
            {likes > 0 && <span>{likes}</span>}
          </Button>

          {onReply && (
            <Button
              variant="ghost"
              size="small"
              className="comment-item__action"
              onClick={onReply}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Reply
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
