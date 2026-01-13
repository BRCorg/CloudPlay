import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signup } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import type { ZodFieldError, ApiError } from "../../redux/auth/types";

export default function Signup() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);

    const resultAction = await dispatch(signup(formData));

    if (signup.fulfilled.match(resultAction)) {
      // Redirection immédiate après succès
      navigate("/profile-setup", { replace: true });
    }
    // Sinon erreurs gérées via state.error
  };

  // Fonction pour récupérer les erreurs par champ
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

      {/* Message générique si présent */}
      {error && typeof error === "object" && error.error && (
        <div style={{ color: "red", marginTop: "10px" }}>{error.error}</div>
      )}
    </form>
  );
}
