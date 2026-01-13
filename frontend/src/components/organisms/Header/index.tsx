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

const Header = ({ user, onLogoClick, onProfileClick, onLogout }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header__container">
        <button type="button" className="header__logo" onClick={onLogoClick}>
          <span className="header__logo-text">CloudPlay</span>
        </button>

        <div className="header__actions">
          {user ? (
            <>
              <button
                type="button"
                className="header__user"
                onClick={onProfileClick}
              >
                <Avatar src={user.avatar} alt={user.name} size="sm" />
                <span className="header__user-name">{user.name}</span>
              </button>

              {onLogout && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              )}
            </>
          ) : (
            <a className="header__link" href="/login">
              Sign in
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
