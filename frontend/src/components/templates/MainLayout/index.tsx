import React from 'react';
import './mainLayout.scss';

export interface MainLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarLeft?: React.ReactNode;
  sidebarRight?: React.ReactNode;
  withSidebar?: boolean;
  withSidebars?: boolean;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  header,
  footer,
  sidebar,
  sidebarLeft,
  sidebarRight,
  withSidebar = false,
  withSidebars = false,
  isLoading = false,
  className = '',
  children,
}) => {
  const layoutClass = [
    'main-layout',
    withSidebar && 'main-layout--with-sidebar',
    withSidebars && 'main-layout--with-sidebars',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={layoutClass}>
      {header && <div className="main-layout__header">{header}</div>}

      <div className="main-layout__container">
        {withSidebars && sidebarLeft && (
          <aside className="main-layout__sidebar-left">{sidebarLeft}</aside>
        )}

        <main className="main-layout__main">
          {isLoading ? (
            <div className="main-layout__loading">
              <div className="spinner">Loading...</div>
            </div>
          ) : (
            <div className="main-layout__content">{children}</div>
          )}
        </main>

        {(withSidebar || withSidebars) && (sidebar || sidebarRight) && (
          <aside className={withSidebars ? 'main-layout__sidebar-right' : 'main-layout__sidebar'}>
            {sidebar || sidebarRight}
          </aside>
        )}
      </div>

      {footer && <div className="main-layout__footer">{footer}</div>}
    </div>
  );
};

export default MainLayout;
