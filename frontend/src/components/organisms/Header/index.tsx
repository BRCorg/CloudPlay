import "./header.scss";

import Avatar from "../../atoms/Avatar";
import Button from "../../atoms/Button";

type User = {
  name: string;
  avatar?: string;
};

export type HeaderProps = {
  user?: User;
  onLogoClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
};

// Composant Header : barre de navigation principale
const Header = ({ user, onLogoClick, onProfileClick, onLogout }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header__container">
        {/* Logo cliquable (retour à l'accueil) */}
        <button type="button" className="header__logo" onClick={onLogoClick}>
          <span className="header__logo-text">CloudPlay</span>
        </button>

        {/* Actions à droite : selon si user connecté ou non */}
        <div className="header__actions">
          {user ? (
            <>
              {/* Bouton profil utilisateur (avatar + nom) */}
              <button
                type="button"
                className="header__user"
                onClick={onProfileClick}
              >
                <Avatar src={user.avatar} alt={user.name} size="sm" />
                <span className="header__user-name">{user.name}</span>
              </button>

              {/* Bouton déconnexion (si onLogout fourni) */}
              {onLogout && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Déconnexion
                </Button>
              )}
            </>
          ) : (
            // Lien vers la page de connexion si pas d'utilisateur
            <a className="header__link" href="/signup">
              S'inscrire
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
