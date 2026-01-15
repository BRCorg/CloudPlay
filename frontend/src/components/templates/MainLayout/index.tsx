import "./mainLayout.scss";

export type MainLayoutProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode; // une seule sidebar
  sidebarPosition?: "left" | "right";
  children: React.ReactNode;
};

// Composant MainLayout : structure principale de la page avec header, footer, sidebar et contenu principal
const MainLayout = ({
  header,
  footer,
  sidebar,
  sidebarPosition = "right",
  children,
}: MainLayoutProps) => {
  return (
    <div className="main-layout">
      {/* En-tête de la page (optionnel) */}
      {header && <div className="main-layout__header">{header}</div>}

      {/* Conteneur principal : sidebar + contenu */}
      <div className="main-layout__container">
        {/* Sidebar à gauche si précisé */}
        {sidebar && sidebarPosition === "left" && (
          <aside className="main-layout__sidebar">{sidebar}</aside>
        )}

        {/* Contenu principal */}
        <main className="main-layout__main">{children}</main>

        {/* Sidebar à droite si précisé */}
        {sidebar && sidebarPosition === "right" && (
          <aside className="main-layout__sidebar">{sidebar}</aside>
        )}
      </div>

      {/* Pied de page (optionnel) */}
      {footer && <div className="main-layout__footer">{footer}</div>}
    </div>
  );
};

export default MainLayout;
