import React from 'react';
import { Avatar } from '../../atoms/Avatar';
import { Text } from '../../atoms/Text';
import './userCard.scss';

export interface UserCardProps {
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  stats?: {
    posts?: number;
    followers?: number;
    following?: number;
  };
  action?: React.ReactNode;
  variant?: 'horizontal' | 'vertical' | 'minimal';
  onClick?: () => void;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  name,
  username,
  avatar,
  bio,
  stats,
  action,
  variant = 'horizontal',
  onClick,
  className = '',
}) => {
  const classes = [
    'user-card',
    variant !== 'horizontal' && `user-card--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      <Avatar
        src={avatar}
        alt={name}
        fallback={name.charAt(0).toUpperCase()}
        size="medium"
        className="user-card__avatar"
      />

      <div className="user-card__info">
        <Text as="h3" weight="semibold" className="user-card__name">
          {name}
        </Text>
        <Text size="sm" color="muted" className="user-card__username">
          @{username}
        </Text>

        {bio && (
          <Text size="sm" color="secondary" className="user-card__bio">
            {bio}
          </Text>
        )}

        {stats && (
          <div className="user-card__stats">
            {stats.posts !== undefined && (
              <div className="user-card__stat">
                <Text as="span" weight="bold" className="user-card__stat-value">
                  {stats.posts}
                </Text>
                <Text as="span" size="sm" color="muted" className="user-card__stat-label">
                  Posts
                </Text>
              </div>
            )}
            {stats.followers !== undefined && (
              <div className="user-card__stat">
                <Text as="span" weight="bold" className="user-card__stat-value">
                  {stats.followers}
                </Text>
                <Text as="span" size="sm" color="muted" className="user-card__stat-label">
                  Followers
                </Text>
              </div>
            )}
            {stats.following !== undefined && (
              <div className="user-card__stat">
                <Text as="span" weight="bold" className="user-card__stat-value">
                  {stats.following}
                </Text>
                <Text as="span" size="sm" color="muted" className="user-card__stat-label">
                  Following
                </Text>
              </div>
            )}
          </div>
        )}
      </div>

      {action && <div className="user-card__action">{action}</div>}
    </div>
  );
};

export default UserCard;
