import React from 'react';
import './profileLayout.scss';

export interface ProfileLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  profile: React.ReactNode;
  sidebar?: React.ReactNode;
  backLink?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  header,
  footer,
  profile,
  sidebar,
  backLink,
  className = '',
  children,
}) => {
  return (
    <div className={`profile-layout ${className}`}>
      {header && <div className="profile-layout__header">{header}</div>}

      <div className="profile-layout__container">
        {backLink && (
          <button className="profile-layout__back" onClick={backLink.onClick}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {backLink.label}
          </button>
        )}

        <div className="profile-layout__profile">{profile}</div>

        <div className="profile-layout__content">
          <main className="profile-layout__main">{children}</main>

          {sidebar && <aside className="profile-layout__sidebar">{sidebar}</aside>}
        </div>
      </div>

      {footer && <div className="profile-layout__footer">{footer}</div>}
    </div>
  );
};

export default ProfileLayout;
