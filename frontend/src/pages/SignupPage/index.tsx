import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signup } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import type { ZodFieldError, ApiError } from "../../redux/auth/types";

export default function Signup() {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // Empêche le double submit

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);

    await dispatch(signup(formData));
  };

  // Redirige automatiquement vers /profile-setup dès que l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      navigate("/profile-setup", { replace: true });
    }
  }, [user, navigate]);

  // Récupère l'erreur d'un champ spécifique
  const getFieldError = (field: string) => {
    const apiError = error as ApiError | null;
    if (apiError?.details && Array.isArray(apiError.details)) {
      const fieldError = apiError.details.find((e: ZodFieldError) =>
        e.path.includes(field)
      );
      return fieldError?.message;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="email"
        />
        {getFieldError("email") && (
          <div style={{ color: "red" }}>{getFieldError("email")}</div>
        )}
      </div>

      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          autoComplete="username"
        />
        {getFieldError("username") && (
          <div style={{ color: "red" }}>{getFieldError("username")}</div>
        )}
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete="new-password"
        />
        {getFieldError("password") && (
          <div style={{ color: "red" }}>{getFieldError("password")}</div>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Inscription..." : "S'inscrire"}
      </button>

      {/* Message générique si erreur non liée à un champ */}
      {error && typeof error === "object" && error.error && (
        <div style={{ color: "red", marginTop: "10px" }}>{error.error}</div>
      )}
    </form>
  );
}
