import { useState } from "react";
import "./signupPage.scss";

import MainLayout from "../../components/templates/MainLayout";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";
import Label from "../../components/atoms/Label";

const SignupPage = () => {
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    console.log("Signup:", form);

    setTimeout(() => setLoading(false), 1000);
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
                Nom d’utilisateur
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Choisissez un nom d’utilisateur"
                value={form.username}
                onChange={onChange}
                required
              />
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
                required
              />
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
                required
              />
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
