import "./profileLayout.scss";

export type ProfileLayoutProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;

  profile: React.ReactNode;
  sidebar?: React.ReactNode;

  onBack?: () => void; // optionnel
  children: React.ReactNode;
};

const ProfileLayout = ({ header, footer, profile, sidebar, onBack, children }: ProfileLayoutProps) => {
  return (
    <div className="profile-layout">
      {header && <div className="profile-layout__header">{header}</div>}

      <div className="profile-layout__container">
        {onBack && (
          <button type="button" className="profile-layout__back" onClick={onBack}>
            ← Back
          </button>
        )}

        <div className="profile-layout__profile">{profile}</div>

        <div className={`profile-layout__content ${sidebar ? "profile-layout__content--with-sidebar" : ""}`}>
          <main className="profile-layout__main">{children}</main>
          {sidebar && <aside className="profile-layout__sidebar">{sidebar}</aside>}
        </div>
      </div>

      {footer && <div className="profile-layout__footer">{footer}</div>}
    </div>
  );
};

export default ProfileLayout;
