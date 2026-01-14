import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logout, updateProfile } from "../../redux/auth/authSlice";
import type { RootState } from "../../app/store";
import "./profile.scss";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";
import Button from "../../components/atoms/Button";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
  };

  const handleEditUsername = () => {
    setNewUsername(user?.username || "");
    setIsEditingUsername(true);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const avatarUrl = preview || user.avatar || "http://localhost:5000/uploads/default.webp";

  // Utilise user.avatar directement (déjà une URL complète)
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
            
            <div className="profile__avatar-section">
              <img 
                src={avatarUrl} 
                alt={user.username}
                className="profile__avatar"
              />
              
              <div className="profile__upload">
                <label htmlFor="avatar-input" className="profile__upload-label">
                  Changer la photo
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="profile__upload-input"
                />
              </div>

              {avatar && (
                <Button onClick={handleUpdateAvatar} disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              )}
            </div>

            <div className="profile__info">
              <div className="profile__field">
                <span className="profile__label">Nom d'utilisateur</span>
                {isEditingUsername ? (
                  <div className="profile__edit-group">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="profile__input"
                      autoFocus
                    />
                    <div className="profile__edit-actions">
                      <Button size="sm" onClick={handleUpdateUsername} disabled={loading}>
                        ✓
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditingUsername(false)}>
                        ✕
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="profile__value-group">
                    <span className="profile__value">{user.username}</span>
                    <button onClick={handleEditUsername} className="profile__edit-btn">
                      Modifier
                    </button>
                  </div>
                )}
              </div>
              
              <div className="profile__field">
                <span className="profile__label">Email</span>
                <span className="profile__value">{user.email}</span>
              </div>
            </div>

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
