import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { createPost, updatePost } from "../../../redux/posts/postsSlice";
import "./postForm.scss";

import Avatar from "../../atoms/Avatar";
import Input from "../../atoms/Input";
import Textarea from "../../atoms/InputTextArea";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";

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
};

const PostForm = ({ user, editMode = false, postId, initialTitle = "", initialContent = "", initialImage, onCancel }: PostFormProps) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.posts);
  
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImage || null);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setPreview(initialImage || null);
  }, [initialTitle, initialContent, initialImage]);

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
      await dispatch(updatePost({
        id: postId,
        title: title.trim(),
        content: content.trim(),
        file: file || undefined,
      }));
      onCancel?.();
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
      {user && (
        <header className="post-form__header">
          <Avatar src={user.avatar} alt={user.name} size="sm" />
          <p className="post-form__username">{user.name}</p>
        </header>
      )}

      <div className="post-form__field">
        <Input
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="post-form__field">
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
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

      {/* Error message display */}
      {error && (
        <div className="post-form__error" style={{ color: 'red', marginBottom: '1rem' }}>
          {Array.isArray(error)
            ? error.map((errMsg, idx) => <div key={idx}>{errMsg}</div>)
            : error}
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
            style={{ display: "none" }}
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