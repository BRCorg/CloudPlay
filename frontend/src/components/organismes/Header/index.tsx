import React from 'react';
import { Avatar } from '../../atoms/Avatar';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { SearchBar } from '../../molecules/SearchBar';
import './header.scss';

interface HeaderProps {
  currentUser?: {
    name: string;
    avatar?: string;
  };
  onLogoClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogoClick,
  onProfileClick,
  onLogout,
  onSearch,
  className = '',
}) => {
  return (
    <header className={`header ${className}`}>
      <div className="header__container">
        {/* Logo */}
        <div className="header__logo" onClick={onLogoClick}>
          <div className="header__logo-icon">C</div>
          <Text as="span" weight="bold" size="lg" className="header__logo-text">
            CloudPlay
          </Text>
        </div>

        {/* Navigation */}
        <nav className="header__nav">
          <a href="/" className="header__nav-link header__nav-link--active">Home</a>
          <a href="/explore" className="header__nav-link">Explore</a>
        </nav>

        {/* Search */}
        {onSearch && (
          <SearchBar
            placeholder="Search..."
            onSearch={onSearch}
            className="header__search"
          />
        )}

        {/* User Menu */}
        <div className="header__user">
          {currentUser ? (
            <>
              <button className="header__user-button" onClick={onProfileClick}>
                <Avatar
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  fallback={currentUser.name.charAt(0).toUpperCase()}
                  size="small"
                  shape="square"
                />
                <Text as="span" weight="medium" className="header__user-name">
                  {currentUser.name}
                </Text>
              </button>
              <Button variant="outline" size="small" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <a href="/login">
              <Button variant="primary">Sign In</Button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
