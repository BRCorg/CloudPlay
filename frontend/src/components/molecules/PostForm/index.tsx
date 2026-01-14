import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { createPost } from "../../../redux/posts/postsSlice";
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
};

const PostForm = ({ user }: PostFormProps) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.posts);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

    await dispatch(createPost({
      title: title.trim(),
      content: content.trim(),
      file: file || undefined,
    }));

    setTitle("");
    setContent("");
    setFile(null);
    setPreview(null);
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

      <div className="post-form__actions">
        <label className="post-form__file-label">
          <span className="post-form__file-button">
            📷 Choisir fichier
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

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
