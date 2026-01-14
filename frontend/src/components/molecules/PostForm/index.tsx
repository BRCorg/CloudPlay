import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { createPost, updatePost, clearPostError } from "../../../redux/posts/postsSlice";
import { getFieldError } from '../../../utils/getFieldError';
import "./postForm.scss";
import type { ApiError } from '../../../redux/auth/types';

import Avatar from "../../atoms/Avatar";
import Input from "../../atoms/Input";
import Textarea from "../../atoms/InputTextArea";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";
import Text from '../../atoms/Text';
import Label from '../../atoms/Label';

type CurrentUser = {
  name: string;
  avatar?: string;
};

export type PostFormProps = {
  user?: CurrentUser;
  editMode?: boolean;
  postId?: string;
  initialTitle?: string;
  initialContent?: string;
  initialImage?: string;
  onCancel?: () => void;
  error?: string | string[] | ApiError | null;
  loading?: boolean;
};

const PostForm = ({ user, editMode = false, postId, initialTitle = "", initialContent = "", initialImage, onCancel, error = null, loading = false }: PostFormProps) => {
  const dispatch = useAppDispatch();
  
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImage || null);

  useEffect(() => {
    dispatch(clearPostError());
    if (title !== initialTitle) setTitle(initialTitle);
    if (content !== initialContent) setContent(initialContent);
    if (preview !== (initialImage || null)) setPreview(initialImage || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTitle, initialContent, initialImage, dispatch]);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !loading;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (editMode && postId) {
      const result = await dispatch(updatePost({
        id: postId,
        title: title.trim(),
        content: content.trim(),
        file: file || undefined,
      }));
      // Ne ferme le formulaire que si l'update est réussie
      if (!('error' in result)) {
        onCancel?.();
      }
    } else {
      await dispatch(createPost({
        title: title.trim(),
        content: content.trim(),
        file: file || undefined,
      }));

      setTitle("");
      setContent("");
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      {typeof error === 'string' && (
        <Text className="text--error">{error}</Text>
      )}
      {Array.isArray(error) && error.length > 0 && (
        <div>
          {error.map((err, idx) => (
            <Text className="text--error" key={idx}>{err}</Text>
          ))}
        </div>
      )}

      {user && (
        <header className="post-form__header">
          <Avatar src={user.avatar} alt={user.name} size="sm" />
          <p className="post-form__username">{user.name}</p>
        </header>
      )}

      <div className="post-form__field">
        <Label htmlFor="post-title" required>Post title</Label>
        <Input
          id="post-title"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {getFieldError(error, 'title') && (
          <Text className="text--error">{getFieldError(error, 'title')}</Text>
        )}
      </div>

      <div className="post-form__field">
        <Label htmlFor="post-content" required>Contenu</Label>
        <Textarea
          id="post-content"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
        {getFieldError(error, 'content') && (
          <Text className="text--error">{getFieldError(error, 'content')}</Text>
        )}
      </div>

      {preview && (
        <div className="post-form__preview">
          <img className="post-form__preview-img" src={preview} alt="Post preview" />
          <button
            type="button"
            className="post-form__remove"
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      <div className="post-form__actions">
        <label className="post-form__file-label">
          <span className="post-form__file-button">
             Choisir image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="post-form__file-input"
          />
        </label>

        {editMode && onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            Annuler
          </Button>
        )}

        <Button type="submit" disabled={!canSubmit}>
          <span className="post-form__submit">
            {loading && <Spinner size="sm" />}
            {loading ? (editMode ? "Updating..." : "Posting...") : (editMode ? "Update" : "Post")}
          </span>
        </Button>
      </div>
    </form>
  );
};

export default PostForm;