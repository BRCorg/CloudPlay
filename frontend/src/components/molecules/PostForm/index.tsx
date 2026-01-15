import React, { useState, useEffect, useReducer } from "react";
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
  type FormState = {
    title: string;
    content: string;
    preview: string | null;
  };
  type FormAction =
    | { type: "SET_TITLE"; payload: string }
    | { type: "SET_CONTENT"; payload: string }
    | { type: "SET_PREVIEW"; payload: string | null }
    | { type: "RESET"; payload: { title: string; content: string; preview: string | null } };

  function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
      case "SET_TITLE":
        return { ...state, title: action.payload };
      case "SET_CONTENT":
        return { ...state, content: action.payload };
      case "SET_PREVIEW":
        return { ...state, preview: action.payload };
      case "RESET":
        return { ...action.payload };
      default:
        return state;
    }
  }

  const [form, dispatchForm] = useReducer(formReducer, {
    title: initialTitle,
    content: initialContent,
    preview: initialImage || null,
  });
  const [file, setFile] = useState<File | null>(null); // Fichier image sélectionné

  // Réinitialise les champs du formulaire uniquement lors d'un changement de postId (ou au montage)
  useEffect(() => {
    dispatch(clearPostError());
    dispatchForm({
      type: "RESET",
      payload: {
        title: initialTitle,
        content: initialContent,
        preview: initialImage || null,
      },
    });
  }, [postId, dispatch, initialTitle, initialContent, initialImage]);

  // Vérifie si le formulaire peut être soumis
  const canSubmit = form.title.trim().length > 0 && form.content.trim().length > 0 && !loading;

  // Gestion du changement de fichier image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatchForm({ type: "SET_PREVIEW", payload: reader.result as string });
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
        title: form.title.trim(),
        content: form.content.trim(),
        file: file || undefined,
      }));
      // Ne ferme le formulaire que si l'update est réussie
      if (!('error' in result)) {
        onCancel?.();
      }
    } else {
      // Mode création : crée un nouveau post
      const result = await dispatch(createPost({
        title: form.title.trim(),
        content: form.content.trim(),
        file: file || undefined,
      }));

      // Réinitialise les champs uniquement si la création a réussi
      if (result.meta && result.meta.requestStatus === 'fulfilled') {
        dispatchForm({ type: "RESET", payload: { title: '', content: '', preview: null } });
        setFile(null);
      }
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
          value={form.title}
          onChange={(e) => dispatchForm({ type: "SET_TITLE", payload: e.target.value })}
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
          value={form.content}
          onChange={(e) => dispatchForm({ type: "SET_CONTENT", payload: e.target.value })}
          rows={4}
          required
        />
        {/* Affiche une erreur spécifique au contenu si présente */}
        {getFieldError(error, 'content') && (
          <Text className="text--error">{getFieldError(error, 'content')}</Text>
        )}
      </div>

      {/* Aperçu de l'image sélectionnée (si présente) */}
      {form.preview && (
        <div className="post-form__preview">
          <img className="post-form__preview-img" src={form.preview} alt="Post preview" />
          <button
            type="button"
            className="post-form__remove"
            onClick={() => {
              setFile(null);
              dispatchForm({ type: "SET_PREVIEW", payload: null });
              // Réinitialise la valeur de l'input file pour permettre un nouvel upload identique
              const fileInput = document.querySelector<HTMLInputElement>(".post-form__file-input");
              if (fileInput) fileInput.value = "";
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