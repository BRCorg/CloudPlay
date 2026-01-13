import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateProfile } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import "./ProfileSetup.scss";

export default function ProfileSetup() {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState(
    user?.avatar ? `http://localhost:5000/uploads/${user.avatar}` : "http://localhost:5000/uploads/default.webp"
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!avatar) return navigate("/");

    const formData = new FormData();
    formData.append("file", avatar);

    const resultAction = await dispatch(updateProfile(formData));

    if (updateProfile.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  const handleSkip = () => navigate("/");

  return (
    <div className="profile-setup">
      <div className="profile-setup__container">
        <h2 className="profile-setup__title">Complétez votre profil</h2>
        <p className="profile-setup__subtitle">
          Ajoutez une photo de profil pour que vos amis vous reconnaissent
        </p>

        <div className="profile-setup__avatar-section">
          <img 
            src={preview} 
            alt="Avatar preview" 
            className="profile-setup__avatar-preview"
          />
          <label htmlFor="avatar-upload" className="profile-setup__avatar-button">
            📷
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="profile-setup__file-input"
          />
        </div>

        <div className="profile-setup__actions">
          <button 
            onClick={handleSave} 
            disabled={!avatar}
            className="profile-setup__button profile-setup__button--primary"
          >
            Enregistrer et continuer
          </button>
          <button 
            onClick={handleSkip}
            className="profile-setup__button profile-setup__button--secondary"
          >
            Plus tard
          </button>
        </div>

        <p className="profile-setup__helper-text">
          Vous pourrez modifier votre photo de profil à tout moment dans les paramètres
        </p>
      </div>
    </div>
  );
}
