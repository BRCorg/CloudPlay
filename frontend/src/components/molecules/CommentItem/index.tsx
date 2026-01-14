import React, { useState } from "react";
import type { IComment } from "../../../redux/comments/types";
import "./commentItem.scss";

import Avatar from "../../atoms/Avatar";
import Textarea from "../../atoms/InputTextArea";
import Button from "../../atoms/Button";

export type CommentItemProps = {
  comment: IComment;
  currentUserId?: string;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
};

const CommentItem = ({ comment, currentUserId, onEdit, onDelete, onLike }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = currentUserId === comment.author._id;
  const isLiked = currentUserId ? comment.likes.includes(currentUserId) : false;

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(comment._id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Supprimer ce commentaire ?")) {
      onDelete(comment._id);
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return "à l'instant";
    if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)}h`;
    return `il y a ${Math.floor(seconds / 86400)}j`;
  };

  return (
    <div className="comment-item">
      <div className="comment-item__avatar">
        <Avatar 
          src={comment.author.avatar ? `http://localhost:5000/uploads/${comment.author.avatar}` : undefined}
          alt={comment.author.username}
          size="sm"
        />
      </div>

      <div className="comment-item__content">
        <div className="comment-item__header">
          <span className="comment-item__author">{comment.author.username}</span>
          <span className="comment-item__time">{timeAgo(comment.createdAt)}</span>
        </div>

        {isEditing ? (
          <div className="comment-item__edit">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
            />
            <div className="comment-item__edit-actions">
              <Button onClick={handleCancel} variant="secondary" size="sm">
                Annuler
              </Button>
              <Button onClick={handleSave} size="sm">
                Enregistrer
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="comment-item__text">{comment.content}</p>

            <div className="comment-item__actions">
              <button 
                className={`comment-item__like ${isLiked ? 'comment-item__like--active' : ''}`}
                onClick={() => onLike(comment._id)}
              >
                <svg viewBox="0 0 24 24" className="comment-item__like-icon" fill={isLiked ? "currentColor" : "none"}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L4.22 13.45 12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {comment.likes.length > 0 && <span>{comment.likes.length}</span>}
              </button>

              {isAuthor && (
                <>
                  <button 
                    className="comment-item__action-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Modifier
                  </button>
                  <button 
                    className="comment-item__action-btn comment-item__action-btn--delete"
                    onClick={handleDelete}
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
