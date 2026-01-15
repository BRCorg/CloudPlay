import "./profileLayout.scss";

export type ProfileLayoutProps = {
  header?: React.ReactNode; // En-tête de la page
  footer?: React.ReactNode; // Pied de page
  profile: React.ReactNode; // Section profil utilisateur
  sidebar?: React.ReactNode; // Sidebar optionnelle
  onBack?: () => void; // Fonction de retour en arrière
  children: React.ReactNode; // Contenu principal de la page
};

// Composant ProfileLayout : structure de page profil utilisateur avec header, footer, profil, sidebar et contenu principal
const ProfileLayout = ({
  header,
  footer,
  profile,
  sidebar,
  onBack,
  children,
}: ProfileLayoutProps) => {
  return (
    <div className="profile-layout">
      {/* En-tête de la page (optionnel) */}
      {header && <div className="profile-layout__header">{header}</div>}

      {/* Conteneur principal : bouton retour, profil, contenu, sidebar */}
      <div className="profile-layout__container">
        {/* Bouton retour en arrière (optionnel) */}
        {onBack && (
          <button
            type="button"
            className="profile-layout__back"
            onClick={onBack}
          >
            ← Retour
          </button>
        )}

        {/* Section profil utilisateur */}
        <div className="profile-layout__profile">{profile}</div>

        {/* Contenu principal et sidebar (optionnelle) */}
        <div
          className={`profile-layout__content ${
            sidebar ? "profile-layout__content--with-sidebar" : ""
          }`}
        >
          <main className="profile-layout__main">{children}</main>
          {sidebar && (
            <aside className="profile-layout__sidebar">{sidebar}</aside>
          )}
        </div>
      </div>

      {/* Pied de page (optionnel) */}
      {footer && <div className="profile-layout__footer">{footer}</div>}
    </div>
  );
};

export default ProfileLayout;
