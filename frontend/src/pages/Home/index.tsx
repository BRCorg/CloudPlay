import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logout } from "../../redux/auth/authSlice";
import type { RootState } from "../../app/store";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";

import Button from "../../components/atoms/Button";
import Badge from "../../components/atoms/Badge";

import "./home.scss";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };




  return (
    <MainLayout 
      header={
        <Header 
          onLogoClick={() => navigate("/")}
          user={user ? { name: user.username, avatar: user.avatar } : undefined}
          onProfileClick={() => navigate("/profile")}
          onLogout={handleLogout}
        />
      } 
      footer={<Footer />}
    >
      <section className="home">
        <div className="home__container">
          <header className="home__header">
            <Badge variant="warning">Prototype frontend</Badge>

            <h1 className="home__title">CloudPlay</h1>

            <p className="home__description">
              Projet React (Vite + React Router) avec données mockées. L’objectif : une UI simple,
              cohérente et maintenable, prête pour une soutenance et un portfolio.
            </p>

                {!isAuthenticated && (
                  <div className="home__actions">
                    <Button size="lg" onClick={() => navigate("/signup")}>Créer un compte</Button>
                    <Button size="lg" variant="outline" onClick={() => navigate("/login")}>Se connecter</Button>
                  </div>
                )}

            <button type="button" className="home__link" onClick={() => navigate("/posts")}>
              Voir le feed de posts →
            </button>
          </header>

          <div className="home__grid">
            <section className="home__card">
              <h2 className="home__card-title">Fonctionnalités (réelles)</h2>
              <ul className="home__list">
                <li className="home__list-item">
                  <span className="home__bullet">📝</span>
                  <span>Créer un post (titre, contenu, image optionnelle)</span>
                </li>
                <li className="home__list-item">
                  <span className="home__bullet">❤️</span>
                  <span>Liker un post et un commentaire (toggle)</span>
                </li>
                <li className="home__list-item">
                  <span className="home__bullet">💬</span>
                  <span>Lire / ajouter des commentaires</span>
                </li>
                <li className="home__list-item">
                  <span className="home__bullet">👤</span>
                  <span>Consulter un profil utilisateur</span>
                </li>
              </ul>
            </section>

            <section className="home__card">
              <h2 className="home__card-title">Tech & contraintes</h2>

              <p className="home__muted">
                Pas d’OAuth, pas de follow, pas de notifications. Les chargements sont gérés au niveau
                des pages (pas dans les layouts).
              </p>

              <div className="home__cta">
                <Button variant="secondary" onClick={() => navigate("/posts")}>
                  Explorer les posts
                </Button>
              </div>
            </section>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
