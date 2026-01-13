import React, { useState } from "react";
import "./postForm.scss";

import Avatar from "../../atoms/Avatar";
import Input from "../../atoms/Input";
import Textarea from "../../atoms/InputTextArea";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";

type PostData = {
  title: string;
  content: string;
  image?: string;
};

type CurrentUser = {
  name: string;
  avatar?: string;
};

export type PostFormProps = {
  user?: CurrentUser;
  loading?: boolean;
  onSubmit: (data: PostData) => void;
};

const PostForm = ({ user, loading = false, onSubmit }: PostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string>("");

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      image: image.trim() ? image.trim() : undefined,
    });

    setTitle("");
    setContent("");
    setImage("");
  };

  const handleAddImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) setImage(url.trim());
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

      {image && (
        <div className="post-form__preview">
          <img className="post-form__preview-img" src={image} alt="Post preview" />
          <button
            type="button"
            className="post-form__remove"
            onClick={() => setImage("")}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      <div className="post-form__actions">
        <Button type="button" variant="secondary" onClick={handleAddImage}>
          Add image
        </Button>

        <Button type="submit" disabled={!canSubmit}>
          <span className="post-form__submit">
            {loading && <Spinner size="sm" />}
            {loading ? "Posting..." : "Post"}
          </span>
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
