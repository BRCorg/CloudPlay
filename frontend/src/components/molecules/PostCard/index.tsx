import React from 'react';
import { Avatar } from '../../atoms/Avatar';
import { Text } from '../../atoms/Text';
import { LikeIcon } from '../../atoms/LikeIcon';
import './postCard.scss';

interface PostCardProps {
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  image?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  isLiked?: boolean;
  onLike?: () => void;
  onClick?: () => void;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  title,
  content,
  author,
  image,
  likes = 0,
  comments = 0,
  timestamp,
  isLiked = false,
  onLike,
  onClick,
  className = '',
}) => {
  return (
    <div className={`post-card ${className}`} onClick={onClick}>
      <div className="post-card__header">
        <Avatar
          src={author.avatar}
          alt={author.name}
          fallback={author.name.charAt(0).toUpperCase()}
          size="medium"
          shape="square"
        />
        <div className="post-card__user-info">
          <Text as="h3" weight="semibold" className="post-card__username">
            {author.name}
          </Text>
          {timestamp && (
            <Text size="sm" color="muted" className="post-card__timestamp">
              {timestamp}
            </Text>
          )}
        </div>
      </div>

      <div className="post-card__content">
        <Text as="h2" size="lg" weight="semibold" className="post-card__title">
          {title}
        </Text>
        <Text color="secondary" className="post-card__text">
          {content}
        </Text>
      </div>

      {image && <img src={image} alt={title} className="post-card__image" />}

      <div className="post-card__footer">
        <button
          className="post-card__stat"
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
        >
          <LikeIcon liked={isLiked} size="small" />
          <span>{likes}</span>
        </button>
        <div className="post-card__stat">💬 {comments}</div>
      </div>
    </div>
  );
};

export default PostCard;
