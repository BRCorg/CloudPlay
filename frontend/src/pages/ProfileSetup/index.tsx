
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateProfile } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import "./ProfileSetup.scss";

// Importation des composants atomiques
import Avatar from "../../components/atoms/Avatar";
import Button from "../../components/atoms/Button";
import Label from "../../components/atoms/Label";
import Input from "../../components/atoms/Input";
import Text from "../../components/atoms/Text";


export default function ProfileSetup() {
  // Récupère l'utilisateur courant depuis le store
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // State local pour le fichier avatar sélectionné
  const [avatar, setAvatar] = useState<File | null>(null);
  // State pour l'aperçu de l'image (url ou base64)
  const [preview, setPreview] = useState(
    user?.avatar || "http://localhost:5000/uploads/default.webp"
  );

  // Gestion du changement d'avatar (input file)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Sauvegarde l'avatar et met à jour le profil
  const handleSave = async () => {
    if (!avatar) return navigate("/");

    const formData = new FormData();
    formData.append("file", avatar);

    const resultAction = await dispatch(updateProfile(formData));

    if (updateProfile.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  // Permet de passer l'étape (skip)
  const handleSkip = () => navigate("/");

  // ------------------- Rendu du composant ------------------- //
  return (
    <div className="profile-setup">
      <div className="profile-setup__container">
        {/* Titre de la page */}
        <h2 className="profile-setup__title">Complétez votre profil</h2>
        {/* Sous-titre */}
        <Text className="profile-setup__subtitle" muted>
          Ajoutez une photo de profil pour que vos amis vous reconnaissent
        </Text>

        {/* Section avatar */}
        <div className="profile-setup__avatar-section">
          {/* Aperçu de l'avatar avec composant atomique */}
          <Avatar src={preview} alt="Avatar preview" size="lg" className="profile-setup__avatar-preview" />
          {/* Label atomique pour le bouton d'upload */}
          <Label htmlFor="avatar-upload" className="profile-setup__avatar-button">
            📷
          </Label>
          {/* Input atomique pour le fichier */}
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="profile-setup__file-input"
          />
        </div>

        {/* Actions (boutons) */}
        <div className="profile-setup__actions">
          {/* Bouton principal atomique */}
          <Button
            onClick={handleSave}
            disabled={!avatar}
            variant="primary"
            className="profile-setup__button"
          >
            Enregistrer et continuer
          </Button>
          {/* Bouton secondaire atomique */}
          <Button
            onClick={handleSkip}
            variant="secondary"
            className="profile-setup__button"
          >
            Plus tard
          </Button>
        </div>

        {/* Texte d'aide */}
        <Text className="profile-setup__helper-text" muted>
          Vous pourrez modifier votre photo de profil à tout moment dans les paramètres
        </Text>
      </div>
    </div>
  );
}