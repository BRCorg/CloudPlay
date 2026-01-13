import React, { useState } from 'react';
import { Avatar } from '../../atoms/Avatar';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Text } from '../../atoms/Text';
import { Spinner } from '../../atoms/Spinner';
import { CommentItem } from '../../molecules/CommentItem';
import './commentSection.scss';

export interface Comment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes?: number;
  isLiked?: boolean;
}

export interface CommentSectionProps {
  comments: Comment[];
  currentUser?: {
    name: string;
    avatar?: string;
  };
  onAddComment?: (content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments = [],
  currentUser,
  onAddComment,
  onLikeComment,
  onReplyComment,
  isLoading = false,
  className = '',
}) => {
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment?.(newComment);
      setNewComment('');
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return 0; // recent - assume already sorted
  });

  return (
    <div className={`comment-section ${className}`}>
      <div className="comment-section__header">
        <Text as="h3" size="lg" weight="semibold" className="comment-section__title">
          Comments
          <Text as="span" color="muted" className="comment-section__count">
            ({comments.length})
          </Text>
        </Text>

        <div className="comment-section__sort">
          <Button
            variant={sortBy === 'recent' ? 'primary' : 'ghost'}
            size="small"
            onClick={() => setSortBy('recent')}
          >
            Recent
          </Button>
          <Button
            variant={sortBy === 'popular' ? 'primary' : 'ghost'}
            size="small"
            onClick={() => setSortBy('popular')}
          >
            Popular
          </Button>
        </div>
      </div>

      {currentUser && (
        <form className="comment-section__form" onSubmit={handleSubmit}>
          <div className="comment-section__form-avatar">
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.name}
              fallback={currentUser.name.charAt(0).toUpperCase()}
              size="small"
            />
          </div>

          <div className="comment-section__form-content">
            <Input
              multiline
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="comment-section__textarea"
            />

            <div className="comment-section__form-actions">
              <Button type="submit" variant="primary" disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="comment-section__loading">
          <Spinner size="large" />
          <Text color="muted">Loading comments...</Text>
        </div>
      ) : comments.length === 0 ? (
        <div className="comment-section__empty">
          <div className="comment-section__empty-icon">💬</div>
          <Text as="h4" size="lg" weight="semibold" className="comment-section__empty-title">
            No comments yet
          </Text>
          <Text color="muted" className="comment-section__empty-text">
            Be the first to share your thoughts!
          </Text>
        </div>
      ) : (
        <div className="comment-section__list">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              author={comment.author}
              content={comment.content}
              timestamp={comment.timestamp}
              likes={comment.likes}
              isLiked={comment.isLiked}
              onLike={() => onLikeComment?.(comment.id)}
              onReply={() => onReplyComment?.(comment.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
