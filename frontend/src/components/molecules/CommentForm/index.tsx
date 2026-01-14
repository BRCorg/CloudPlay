import React, { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { createComment } from "../../../redux/comments/commentsSlice";
import "./commentForm.scss";

import Avatar from "../../atoms/Avatar";
import Textarea from "../../atoms/InputTextArea";
import Button from "../../atoms/Button";

type CurrentUser = {
  name: string;
  avatar?: string;
};

export type CommentFormProps = {
  postId: string;
  user?: CurrentUser;
};

const CommentForm = ({ postId, user }: CommentFormProps) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");
  const error = useAppSelector((state) => state.comments.error);

  const canSubmit = content.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    await dispatch(createComment({
      postId,
      content: content.trim(),
    }));

    setContent("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      {user && (
        <div className="comment-form__header">
          <Avatar src={user.avatar} alt={user.name} size="sm" />
        </div>
      )}
      
      {/* Error message display */}
      {error && (
        <div className="comment-form__error" style={{ color: 'red', marginBottom: '1rem' }}>
          {Array.isArray(error)
            ? error.map((errMsg, idx) => <div key={idx}>{errMsg}</div>)
            : error}
        </div>
      )}
      <div className="comment-form__content">
        <Textarea
          placeholder="Ajouter un commentaire..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          required
        />
        
        <Button type="submit" disabled={!canSubmit} size="sm">
          Commenter
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
