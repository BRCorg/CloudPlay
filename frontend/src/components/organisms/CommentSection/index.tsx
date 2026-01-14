import React, { useState } from "react";
import "./commentSection.scss";

import Avatar from "../../atoms/Avatar";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";
import Textarea from "../../atoms/InputTextArea";
import Spinner from "../../atoms/Spinner";
import CommentItem from "../../molecules/CommentItem";

export type Comment = {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes?: number;
  liked?: boolean;
};

export type CommentSectionProps = {
  comments: Comment[];
  user?: { name: string; avatar?: string };

  loading?: boolean;

  onAdd: (content: string) => void;
  onLike?: (id: string) => void;
  onReply?: (id: string) => void;
};

const CommentSection = ({
  comments,
  user,
  loading = false,
  onAdd,
  onLike,
  onReply,
}: CommentSectionProps) => {
  const [value, setValue] = useState("");

  const canPost = value.trim().length > 0 && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPost) return;
    onAdd(value.trim());
    setValue("");
  };

  return (
    <section className="comment-section">
      <header className="comment-section__header">
        <h3 className="comment-section__title">
          Comments <span className="comment-section__count">({comments.length})</span>
        </h3>
      </header>

      {user && (
        <form className="comment-section__form" onSubmit={handleSubmit}>
          <Avatar src={user.avatar} alt={user.name} size="sm" />

          <div className="comment-section__form-body">
            <Textarea
              placeholder="Write a comment..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
              required
            />

            <div className="comment-section__form-actions">
              <Button type="submit" disabled={!canPost}>
                Post
              </Button>
            </div>
          </div>
        </form>
      )}

      {loading && (
        <div className="comment-section__loading" role="status">
          <Spinner size="md" />
          <Text muted>Loading comments...</Text>
        </div>
      )}

      {!loading && comments.length === 0 && (
        <div className="comment-section__empty">
          <div className="comment-section__empty-icon">💬</div>
          <p className="comment-section__empty-title">No comments yet</p>
          <Text muted>Be the first to share your thoughts!</Text>
        </div>
      )}

      {!loading && comments.length > 0 && (
        <div className="comment-section__list">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              author={c.author}
              content={c.content}
              timestamp={c.timestamp}
              likes={c.likes ?? 0}
              liked={c.liked ?? false}
              onLike={onLike ? () => onLike(c.id) : undefined}
              onReply={onReply ? () => onReply(c.id) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;