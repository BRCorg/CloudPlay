import React, { useState } from 'react';
import { Avatar } from '../../atoms/Avatar';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { Spinner } from '../../atoms/Spinner';
import './postForm.scss';

interface PostFormProps {
  onSubmit?: (data: { title: string; content: string; image?: string }) => void;
  currentUser?: {
    name: string;
    avatar?: string;
  };
  isLoading?: boolean;
  className?: string;
}

export const PostForm: React.FC<PostFormProps> = ({
  onSubmit,
  currentUser,
  isLoading = false,
  className = '',
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ title, content, image: image || undefined });
    setTitle('');
    setContent('');
    setImage('');
  };

  return (
    <form className={`post-form ${className}`} onSubmit={handleSubmit}>
      {currentUser && (
        <div className="post-form__header">
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            fallback={currentUser.name.charAt(0).toUpperCase()}
            size="small"
            shape="square"
          />
          <div className="post-form__user-info">
            <Text weight="semibold" className="post-form__username">
              {currentUser.name}
            </Text>
          </div>
        </div>
      )}

      <div className="post-form__field">
        <Input
          type="text"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="post-form__field">
        <Input
          multiline
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="post-form__textarea"
        />
      </div>

      {image && (
        <div className="post-form__image-preview">
          <img src={image} alt="Preview" />
          <Button
            type="button"
            variant="ghost"
            size="small"
            className="post-form__remove-image"
            onClick={() => setImage('')}
          >
            ✕
          </Button>
        </div>
      )}

      <div className="post-form__actions">
        <div className="post-form__toolbar">
          <Button
            type="button"
            variant="ghost"
            className="post-form__tool-button"
            onClick={() => {
              const url = prompt('Enter image URL:');
              if (url) setImage(url);
            }}
          >
            🖼️
          </Button>
        </div>

        <Button type="submit" variant="primary" disabled={isLoading || !title || !content}>
          {isLoading ? <><Spinner size="small" variant="light" /> Posting...</> : 'Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
