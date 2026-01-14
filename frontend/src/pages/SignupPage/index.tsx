import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signup } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import type { ZodFieldError, ApiError } from "../../redux/auth/types";
import type { RootState } from "../../app/store";
import "./signupPage.scss";
 
import MainLayout from "../../components/templates/MainLayout";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";
import Label from "../../components/atoms/Label";
 
const SignupPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
 
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
 
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
 
  const passwordsMatch =
    form.password.trim().length > 0 &&
    form.confirmPassword.trim().length > 0 &&
    form.password === form.confirmPassword;
 
  const canSubmit =
    form.username.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.password.trim().length > 0 &&
    form.confirmPassword.trim().length > 0 &&
    passwordsMatch &&
    !loading;
 
  useEffect(() => {
    if (user) {
      navigate("/profile-setup", { replace: true });
    }
  }, [user, navigate]);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
 
    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("password", form.password);
 
    await dispatch(signup(formData));
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
    <MainLayout>
      <section className="signup-page">
        <div className="signup-page__container">
          <header className="signup-page__header">
            <p className="signup-page__brand">CloudPlay</p>
            <h1 className="signup-page__title">Inscription</h1>
          </header>
 
          <form className="signup-page__form" onSubmit={handleSubmit}>
            <div className="signup-page__field">
              <Label htmlFor="username" required>
                Nom d'utilisateur
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Choisissez un nom d'utilisateur"
                value={form.username}
                onChange={onChange}
                error={!!getFieldError("username")}
                required
              />
              {getFieldError("username") && (
                <p className="signup-page__error" role="alert">
                  {getFieldError("username")}
                </p>
              )}
            </div>
 
            <div className="signup-page__field">
              <Label htmlFor="email" required>
                Adresse e-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={onChange}
                error={!!getFieldError("email")}
                required
              />
              {getFieldError("email") && (
                <p className="signup-page__error" role="alert">
                  {getFieldError("email")}
                </p>
              )}
            </div>
 
            <div className="signup-page__field">
              <Label htmlFor="password" required>
                Mot de passe
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Créez un mot de passe"
                value={form.password}
                onChange={onChange}
                error={!!getFieldError("password")}
                required
              />
              {getFieldError("password") && (
                <p className="signup-page__error" role="alert">
                  {getFieldError("password")}
                </p>
              )}
            </div>
 
            <div className="signup-page__field">
              <Label htmlFor="confirmPassword" required>
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirmez votre mot de passe"
                value={form.confirmPassword}
                onChange={onChange}
                error={form.confirmPassword.length > 0 && !passwordsMatch}
                required
              />
 
              {form.confirmPassword && !passwordsMatch && (
                <p className="signup-page__error" role="alert">
                  Les mots de passe ne correspondent pas.
                </p>
              )}
            </div>
 
            <Button type="submit" disabled={!canSubmit}>
              {loading ? "Création en cours…" : "Créer un compte"}
            </Button>
 
            {/* Message d'erreur générique */}
            {error && typeof error === "object" && error.error && (
              <p className="signup-page__error" role="alert">
                {error.error}
              </p>
            )}
          </form>
 
          <footer className="signup-page__footer">
            <p className="signup-page__muted">
              Vous avez déjà un compte ? <a href="/login">Se connecter</a>
            </p>
          </footer>
        </div>
      </section>
    </MainLayout>
  );
};
 
export default SignupPage;