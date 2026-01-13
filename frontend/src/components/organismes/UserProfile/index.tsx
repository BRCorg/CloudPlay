import React, { useState } from 'react';
import { Avatar } from '../../atoms/Avatar';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { Badge } from '../../atoms/Badge';
import './userProfile.scss';

export interface UserProfileProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    website?: string;
    joinDate?: string;
  };
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes?: number;
  };
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onEdit?: () => void;
  onMessage?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  stats,
  isOwnProfile = false,
  isFollowing = false,
  onFollow,
  onEdit,
  onMessage,
  className = '',
  children,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes' | 'about'>('posts');

  return (
    <div className={`user-profile ${className}`}>
      {/* Cover Image */}
      <div className="user-profile__cover">
        {user.coverImage ? (
          <>
            <img src={user.coverImage} alt="Cover" />
            <div className="user-profile__cover-gradient" />
          </>
        ) : (
          <div className="user-profile__cover-gradient" />
        )}
      </div>

      {/* Profile Content */}
      <div className="user-profile__content">
        <div className="user-profile__header">
          <div className="user-profile__avatar-wrapper">
            <Avatar
              src={user.avatar}
              alt={user.name}
              fallback={user.name.charAt(0).toUpperCase()}
              size="xlarge"
              shape="square"
            />
            {isOwnProfile && (
              <Button variant="ghost" size="small" className="user-profile__edit-avatar">
                ✏️
              </Button>
            )}
          </div>

          <div className="user-profile__actions">
            {isOwnProfile ? (
              <Button variant="outline" onClick={onEdit}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant={isFollowing ? 'secondary' : 'primary'}
                  onClick={onFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                {onMessage && (
                  <Button variant="outline" onClick={onMessage}>
                    Message
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="user-profile__info">
          <Text as="h1" size="2xl" weight="bold" className="user-profile__name">
            {user.name}
          </Text>
          <Text color="muted" className="user-profile__username">
            @{user.username}
          </Text>

          {user.bio && (
            <Text className="user-profile__bio">{user.bio}</Text>
          )}

          <div className="user-profile__meta">
            {user.location && (
              <Badge variant="secondary" size="small">
                📍 {user.location}
              </Badge>
            )}
            {user.website && (
              <Badge variant="info" size="small">
                🔗 <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a>
              </Badge>
            )}
            {user.joinDate && (
              <Badge variant="secondary" size="small">
                📅 Joined {user.joinDate}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="user-profile__stats">
          <div className="user-profile__stat">
            <Text as="div" size="xl" weight="bold" className="user-profile__stat-value">
              {stats.posts}
            </Text>
            <Text as="div" size="sm" color="muted" className="user-profile__stat-label">
              Posts
            </Text>
          </div>
          <div className="user-profile__stat">
            <Text as="div" size="xl" weight="bold" className="user-profile__stat-value">
              {stats.followers}
            </Text>
            <Text as="div" size="sm" color="muted" className="user-profile__stat-label">
              Followers
            </Text>
          </div>
          <div className="user-profile__stat">
            <Text as="div" size="xl" weight="bold" className="user-profile__stat-value">
              {stats.following}
            </Text>
            <Text as="div" size="sm" color="muted" className="user-profile__stat-label">
              Following
            </Text>
          </div>
          {stats.likes !== undefined && (
            <div className="user-profile__stat">
              <Text as="div" size="xl" weight="bold" className="user-profile__stat-value">
                {stats.likes}
              </Text>
              <Text as="div" size="sm" color="muted" className="user-profile__stat-label">
                Likes
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="user-profile__tabs">
        <Button
          variant={activeTab === 'posts' ? 'primary' : 'ghost'}
          className={`user-profile__tab ${activeTab === 'posts' ? 'user-profile__tab--active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </Button>
        <Button
          variant={activeTab === 'media' ? 'primary' : 'ghost'}
          className={`user-profile__tab ${activeTab === 'media' ? 'user-profile__tab--active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Media
        </Button>
        <Button
          variant={activeTab === 'likes' ? 'primary' : 'ghost'}
          className={`user-profile__tab ${activeTab === 'likes' ? 'user-profile__tab--active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          Likes
        </Button>
        <Button
          variant={activeTab === 'about' ? 'primary' : 'ghost'}
          className={`user-profile__tab ${activeTab === 'about' ? 'user-profile__tab--active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </Button>
      </div>

      {/* Tab Content */}
      <div className="user-profile__tab-content">
        {children}
      </div>
    </div>
  );
};

export default UserProfile;
