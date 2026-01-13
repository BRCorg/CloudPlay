import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { updateProfile } from "../../redux/auth/authSlice";

import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup() {
  const { user } = useAppSelector((state) => state.auth);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState(user?.avatar ? `/uploads/${user.avatar}` : "/uploads/default-avatar.png");
  

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const dispatch = useAppDispatch();
const navigate = useNavigate();

const handleSave = async () => {
  if (!avatar) return navigate("/me");

  const formData = new FormData();
  formData.append("file", avatar);

  const resultAction = await dispatch(updateProfile(formData));

  if (updateProfile.fulfilled.match(resultAction)) {
    navigate("/me"); // Redirige vers la page profil
  }
};


  const handleSkip = () => navigate("/");

  return (
    <div>
      <h2>Profile Setup</h2>
      <img src={preview} alt="Avatar preview" style={{ width: 100, height: 100, borderRadius: "50%" }} />
      <input type="file" accept="image/*" onChange={handleAvatarChange} />
      <div>
        <button onClick={handleSave}>Terminer</button>
        <button onClick={handleSkip}>Plus tard</button>
      </div>
    </div>
  );
}
