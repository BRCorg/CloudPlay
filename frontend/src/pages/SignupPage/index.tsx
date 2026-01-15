import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signup } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { getFieldError } from "../../utils/getFieldError";
import type { RootState } from "../../app/store";
import "./signupPage.scss";
 
import MainLayout from "../../components/templates/MainLayout";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";
import Label from "../../components/atoms/Label";
 

const SignupPage = () => {
  // Initialisation du dispatch Redux et récupération des états du store
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // State local pour le formulaire d'inscription
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Gère la modification des champs du formulaire
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Vérifie si les mots de passe sont identiques et non vides
  const passwordsMatch =
    form.password.trim().length > 0 &&
    form.confirmPassword.trim().length > 0 &&
    form.password === form.confirmPassword;

  // Vérifie si le formulaire peut être soumis
  const canSubmit =
    form.username.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.password.trim().length > 0 &&
    form.confirmPassword.trim().length > 0 &&
    passwordsMatch &&
    !loading;

  // Redirige vers la page de setup profil si l'utilisateur est connecté après inscription
  useEffect(() => {
    if (user) {
      navigate("/profile-setup", { replace: true });
    }
  }, [user, navigate]);

  // Gère la soumission du formulaire d'inscription
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("password", form.password);

    await dispatch(signup(formData));
  };

  // Utilise le helper centralisé pour récupérer l'erreur d'un champ
  const getSignupFieldError = (field: string) => getFieldError(error ?? null, field);

  // ------------------- Rendu du composant ------------------- //
  return (
    <MainLayout>
      <section className="signup-page">
        <div className="signup-page__container">
          {/* En-tête de la page d'inscription */}
          <header className="signup-page__header">
            <p className="signup-page__brand">CloudPlay</p>
            <h1 className="signup-page__title">Inscription</h1>
          </header>

          {/* Formulaire d'inscription */}
          <form className="signup-page__form" onSubmit={handleSubmit}>
            {/* Champ nom d'utilisateur */}
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
                error={!!getSignupFieldError("username")}
                required
              />
              {/* Affichage de l'erreur pour le champ username */}
              {getSignupFieldError("username") && (
                <p className="signup-page__error" role="alert">
                  {getSignupFieldError("username")}
                </p>
              )}
            </div>

            {/* Champ email */}
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
                error={!!getSignupFieldError("email")}
                required
              />
              {/* Affichage de l'erreur pour le champ email */}
              {getSignupFieldError("email") && (
                <p className="signup-page__error" role="alert">
                  {getSignupFieldError("email")}
                </p>
              )}
            </div>

            {/* Champ mot de passe */}
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
                error={!!getSignupFieldError("password")}
                required
              />
              {/* Affichage de l'erreur pour le champ password */}
              {getSignupFieldError("password") && (
                <p className="signup-page__error" role="alert">
                  {getSignupFieldError("password")}
                </p>
              )}
            </div>

            {/* Champ confirmation du mot de passe */}
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

              {/* Affichage de l'erreur si les mots de passe ne correspondent pas */}
              {form.confirmPassword && !passwordsMatch && (
                <p className="signup-page__error" role="alert">
                  Les mots de passe ne correspondent pas.
                </p>
              )}
            </div>

            {/* Bouton de soumission */}
            <Button type="submit" disabled={!canSubmit}>
              {loading ? "Création en cours…" : "Créer un compte"}
            </Button>

            {/* Message d'erreur générique (affiché seulement s'il n'y a pas de details Zod) */}
            {error && typeof error === "object" && error.error && !("details" in error) && (
              <p className="signup-page__error" role="alert">
                {error.error}
              </p>
            )}
          </form>

          {/* Pied de page avec lien vers la connexion */}
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