import React from 'react';
import { Spinner } from '../../atoms/Spinner';
import { Text } from '../../atoms/Text';
import { PostCard } from '../../molecules/PostCard';
import './postList.scss';

interface Post {
  id: string;
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
}

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  onPostClick?: (postId: string) => void;
  onLike?: (postId: string) => void;
  className?: string;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  isLoading = false,
  onPostClick,
  onLike,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`post-list ${className}`}>
        <div className="post-list__loading">
          <Spinner size="large" />
          <Text color="muted">Loading posts...</Text>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`post-list ${className}`}>
        <div className="post-list__empty">
          <div className="post-list__empty-icon">📝</div>
          <Text as="h3" size="xl" weight="semibold" className="post-list__empty-title">
            No posts yet
          </Text>
          <Text color="muted" className="post-list__empty-text">
            Be the first to create a post and share your thoughts!
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className={`post-list ${className}`}>
      <div className="post-list__items">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            content={post.content}
            author={post.author}
            image={post.image}
            likes={post.likes}
            comments={post.comments}
            timestamp={post.timestamp}
            isLiked={post.isLiked}
            onClick={() => onPostClick?.(post.id)}
            onLike={() => onLike?.(post.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;
