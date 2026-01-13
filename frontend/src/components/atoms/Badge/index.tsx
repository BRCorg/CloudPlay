import React from 'react';
import './badge.scss';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
export type BadgeSize = 'small' | 'medium' | 'large';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  solid?: boolean;
  withDot?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'medium',
  solid = false,
  withDot = false,
  interactive = false,
  className = '',
  onClick,
  children,
}) => {
  const classes = [
    'badge',
    solid ? `badge--solid-${variant}` : `badge--${variant}`,
    size !== 'medium' && `badge--${size}`,
    withDot && 'badge--with-dot',
    interactive && 'badge--interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} onClick={onClick}>
      {children}
    </span>
  );
};

export default Badge;
