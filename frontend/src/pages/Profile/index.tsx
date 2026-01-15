import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logout, updateProfile, clearError } from "../../redux/auth/authSlice";
import type { RootState } from "../../app/store";
import "./profile.scss";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import Label from "../../components/atoms/Label";
import Avatar from "../../components/atoms/Avatar";
import { getFieldError } from "../../utils/getFieldError";

// Page de profil utilisateur : permet de voir et modifier son profil
const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state: RootState) => state.auth);

  // États locaux pour la gestion de l'avatar et du username
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  // Gestion du changement d'avatar (prévisualisation)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Envoie la nouvelle photo de profil au backend
  const handleUpdateAvatar = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append("file", avatar);

    const resultAction = await dispatch(updateProfile(formData));

    if (updateProfile.fulfilled.match(resultAction)) {
      setAvatar(null);
      setPreview(null);
    }
  };

  // Envoie le nouveau username au backend
  const handleUpdateUsername = async () => {
    if (!newUsername.trim() || newUsername === user?.username) {
      setIsEditingUsername(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", newUsername);

    const resultAction = await dispatch(updateProfile(formData));

    if (updateProfile.fulfilled.match(resultAction)) {
      setIsEditingUsername(false);
      setNewUsername("");
    }
    // NE PAS fermer l’édition si erreur, pour laisser l’erreur visible
  };

  // Passe en mode édition du username
  const handleEditUsername = () => {
    dispatch(clearError());
    setNewUsername(user?.username || "");
    setIsEditingUsername(true);
  };

  // Déconnexion utilisateur
  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  // Redirige vers la page de connexion si pas d'utilisateur
  if (!user) {
    navigate("/login");
    return null;
  }

  // Génère l'URL de l'avatar à afficher
  const getAvatarUrl = (avatar: string | undefined) =>
    avatar && avatar.startsWith("http")
      ? avatar
      : `http://localhost:5000/uploads/${avatar || "default.webp"}`;
  const avatarUrl = preview || getAvatarUrl(user.avatar);

  // ------------------- Rendu du composant -------------------//
  return (
    <MainLayout
      header={
        <Header 
          user={{ name: user.username, avatar: user.avatar }}
          onLogoClick={() => navigate("/")}
          onProfileClick={() => navigate("/profile")}
          onLogout={handleLogout}
        />
      }
      footer={<Footer />}
    >
      <section className="profile">
        <div className="profile__container">
          <div className="profile__card">
            <h1 className="profile__title">Mon Profil</h1>
            

            {/* Section avatar + upload */}
            <div className="profile__avatar-section">
              <Avatar src={avatarUrl} alt={user.username} size="lg" className="profile__avatar" />
              <div className="profile__upload">
                <Label htmlFor="avatar-input" className="profile__upload-label">
                  Changer la photo
                </Label>
                <Input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="profile__upload-input"
                />
              </div>

              {/* Bouton pour enregistrer la nouvelle photo */}
              {avatar && (
                <Button onClick={handleUpdateAvatar} disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              )}

              {/* Affichage d'une erreur d'upload globale ou détaillée */}
              {error && typeof error === 'object' && error !== null && error.error && !getFieldError(error, 'username') && (
                <div className="profile__field-error" role="alert" style={{ marginTop: 8 }}>
                  {Array.isArray(error.details) && error.details.length > 0
                    ? error.details.map((e, i) => <div key={i}>{e.message || JSON.stringify(e)}</div>)
                    : typeof error.details === 'string' && error.details
                      ? error.details
                      : error.error}
                </div>
              )}
            </div>

            {/* Infos utilisateur et édition du username */}
            <div className="profile__info">
              <div className="profile__field">
                <span className="profile__label">Nom d'utilisateur</span>
                {isEditingUsername ? (
                  <div className="profile__edit-group">
                    <Label htmlFor="username-edit" required>
                      Nouveau nom d'utilisateur
                    </Label>
                    <Input
                      id="username-edit"
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="profile__input"
                      autoFocus
                      placeholder="Nouveau nom d'utilisateur"
                      error={!!getFieldError(error ?? null, 'username')}
                    />
                    {/* Affichage de l'erreur de validation du username */}
                    {getFieldError(error ?? null, 'username') && (
                      <div className="profile__field-error" role="alert">
                        {getFieldError(error ?? null, 'username')}
                      </div>
                    )}
                    <div className="profile__edit-actions">
                      <Button size="sm" onClick={handleUpdateUsername} disabled={loading}>
                        ✓
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        dispatch(clearError());
                        setIsEditingUsername(false);
                      }}>
                        ✕
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="profile__value-group">
                    <span className="profile__value">{user.username}</span>
                    <Button onClick={handleEditUsername} className="profile__edit-btn" size="sm" variant="secondary">
                      Modifier
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Affichage de l'email */}
              <div className="profile__field">
                <span className="profile__label">Email</span>
                <span className="profile__value">{user.email}</span>
              </div>
            </div>

            {/* Bouton de déconnexion */}
            <div className="profile__actions">
              <Button variant="outline" onClick={handleLogout}>
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Profile;