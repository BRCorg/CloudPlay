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


// Composant PostForm : formulaire pour créer ou éditer un post
const PostForm = ({ user, editMode = false, postId, initialTitle = "", initialContent = "", initialImage, onCancel, error = null, loading = false }: PostFormProps) => {
  const dispatch = useAppDispatch();

  // États locaux pour les champs du formulaire
  const [title, setTitle] = useState(initialTitle); // Titre du post
  const [content, setContent] = useState(initialContent); // Contenu du post
  const [file, setFile] = useState<File | null>(null); // Fichier image sélectionné
  const [preview, setPreview] = useState<string | null>(initialImage || null); // Aperçu de l'image

  // Réinitialise les champs du formulaire uniquement lors d'un changement de postId (ou au montage)
  useEffect(() => {
    dispatch(clearPostError());
    setTitle(initialTitle);
    setContent(initialContent);
    setPreview(initialImage || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, dispatch]);

  // Vérifie si le formulaire peut être soumis
  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !loading;

  // Gestion du changement de fichier image
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

  // Soumission du formulaire (création ou édition)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (editMode && postId) {
      // Mode édition : met à jour le post existant
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
      // Mode création : crée un nouveau post
      await dispatch(createPost({
        title: title.trim(),
        content: content.trim(),
        file: file || undefined,
      }));

      // Réinitialise les champs après création
      setTitle("");
      setContent("");
      setFile(null);
      setPreview(null);
    }
  };

  // ------------------- Rendu du composant -------------------//
  return (
    <form className="post-form" onSubmit={handleSubmit}>
      {/* Affiche une erreur globale si présente (string) */}
      {typeof error === 'string' && (
        <Text className="text--error">{error}</Text>
      )}
      {/* Affiche une liste d'erreurs si error est un tableau */}
      {Array.isArray(error) && error.length > 0 && (
        <div>
          {error.map((err, idx) => (
            <Text className="text--error" key={idx}>{err}</Text>
          ))}
        </div>
      )}

      {/* Affiche l'utilisateur courant (avatar + nom) si fourni */}
      {user && (
        <header className="post-form__header">
          <Avatar src={user.avatar} alt={user.name} size="sm" />
          <p className="post-form__username">{user.name}</p>
        </header>
      )}

      {/* Champ titre du post */}
      <div className="post-form__field">
        <Label htmlFor="post-title" required>Post title</Label>
        <Input
          id="post-title"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {/* Affiche une erreur spécifique au titre si présente */}
        {getFieldError(error, 'title') && (
          <Text className="text--error">{getFieldError(error, 'title')}</Text>
        )}
      </div>

      {/* Champ contenu du post */}
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
        {/* Affiche une erreur spécifique au contenu si présente */}
        {getFieldError(error, 'content') && (
          <Text className="text--error">{getFieldError(error, 'content')}</Text>
        )}
      </div>

      {/* Aperçu de l'image sélectionnée (si présente) */}
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

      {/* Actions du formulaire : upload image, annuler, soumettre */}
      <div className="post-form__actions">
        {/* Bouton pour choisir une image */}
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

        {/* Bouton annuler (en mode édition) */}
        {editMode && onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            Annuler
          </Button>
        )}

        {/* Bouton soumettre (créer ou éditer) */}
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