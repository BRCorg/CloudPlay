import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logout } from "../../redux/auth/authSlice";
import type { RootState } from "../../app/store";
 
import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";
 
import Button from "../../components/atoms/Button";
 
import { initParallaxEffect, initParticles } from "./home";
import "./home.scss";
 
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
 
  useEffect(() => {
    // Initialize interactive effects
    initParallaxEffect();
    initParticles();
  }, []);
 
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
        <div className="home__particles"></div>
        <div className="home__decor home__decor--1"></div>
        <div className="home__decor home__decor--2"></div>
 
        <div className="home__container">
          <div className="home__hero">
            <p className="home__tagline">Next Generation Cloud Platform</p>
            <h1 className="home__title">CloudPlay</h1>
            <p className="home__description">
              Découvrez l'avenir du partage et de la collaboration dans le cloud.
              Une expérience immersive où vos idées prennent vie.
            </p>
 
            {!isAuthenticated && (
              <div className="home__actions">
                <Button size="lg" onClick={() => navigate("/signup")}>Commencer l'expérience</Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>Se connecter</Button>
              </div>
            )}
 
            <button type="button" className="home__link" onClick={() => navigate("/posts")}>
              Explorer le feed →
            </button>
          </div>
 
          {/* Scrolling invitation text */}
          <div className="home__scrolling-text">
            <div className="home__scrolling-content">
              <span>REJOIGNEZ LA RÉVOLUTION CLOUD</span>
              <span className="separator">✦</span>
              <span>CRÉEZ VOTRE COMPTE GRATUITEMENT</span>
              <span className="separator">✦</span>
              <span>PARTAGEZ VOS IDÉES AVEC LE MONDE</span>
              <span className="separator">✦</span>
              <span>CONNECTEZ-VOUS À L'INNOVATION</span>
              <span className="separator">✦</span>
              <span>EXPLOREZ L'INFINI DES POSSIBILITÉS</span>
              <span className="separator">✦</span>
            </div>
 
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
 
export default Home;