import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "../../redux/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "../../app/store";
import "./loginPage.scss";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import LoginForm from "../../components/molecules/LoginForm";

// Page de connexion utilisateur
const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Récupère l'état de chargement et d'erreur depuis le store auth
  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  // Gestion de la soumission du formulaire de connexion
  const handleSubmit = async (email: string, password: string) => {
    const resultAction = await dispatch(login({ email, password }));

    // Si la connexion réussit, redirige vers la page d'accueil
    if (login.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  // Passe tous les messages d'erreur (tableau ou string) à LoginForm
  // Utilise getFieldError pour extraire les erreurs de champ (si besoin d'affichage direct ici)

  // ------------------- Rendu du composant -------------------//
  return (
    <MainLayout header={<Header onLogoClick={() => navigate("/")} />}>
      <section className="login-page">
        <div className="login-page__container">
          {/* En-tête de la page de connexion */}
          <div className="login-page__header">
            <h1 className="login-page__title">Connexion</h1>
          </div>

          {/* Message d'accès protégé */}
          <div className="login-page__protected-msg">
            <p className="login-page__protected-title">Authentification requise</p>
            <p className="login-page__protected-desc">
              Merci de vous connecter pour accéder à CloudPlay.
            </p>
            {/* Affiche le bouton retour uniquement si l'utilisateur a été redirigé (ex: via /login?from=...) */}
            {location.state && location.state.fromProtected && (
              <button
                className="login-page__back-btn login-page__back-btn--modern"
                type="button"
                onClick={() => navigate("/")}
              >
                Retour à l'accueil
              </button>
            )}
          </div>

          {/* Formulaire de connexion */}
          <LoginForm onSubmit={handleSubmit} error={error} loading={loading} />
        </div>
      </section>
    </MainLayout>
  );
};

export default LoginPage;