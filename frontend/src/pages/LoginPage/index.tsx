import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import "./loginPage.scss";

import MainLayout from "../../components/templates/MainLayout";
import LoginForm from "../../components/molecules/LoginForm";

// Page de connexion utilisateur
const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    <MainLayout>
      <section className="login-page">
        <div className="login-page__container">
          {/* En-tête de la page de connexion */}
          <div className="login-page__header">
            <p className="login-page__brand">CloudPlay</p>
            <h1 className="login-page__title">Connexion</h1>
          </div>

          {/* Formulaire de connexion */}
          <LoginForm onSubmit={handleSubmit} error={error} loading={loading} />
        </div>
      </section>
    </MainLayout>
  );
};

export default LoginPage;