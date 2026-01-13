import "./mainLayout.scss";

export type MainLayoutProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode; // une seule sidebar
  sidebarPosition?: "left" | "right";
  children: React.ReactNode;
};

const MainLayout = ({
  header,
  footer,
  sidebar,
  sidebarPosition = "right",
  children,
}: MainLayoutProps) => {
  return (
    <div className="main-layout">
      {header && <div className="main-layout__header">{header}</div>}

      <div className="main-layout__container">
        {sidebar && sidebarPosition === "left" && (
          <aside className="main-layout__sidebar">{sidebar}</aside>
        )}

        <main className="main-layout__main">{children}</main>

        {sidebar && sidebarPosition === "right" && (
          <aside className="main-layout__sidebar">{sidebar}</aside>
        )}
      </div>

      {footer && <div className="main-layout__footer">{footer}</div>}
    </div>
  );
};

export default MainLayout;
