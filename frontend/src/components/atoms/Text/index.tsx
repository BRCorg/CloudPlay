import React from 'react';
import './text.scss';

export type TextVariant = 'display' | 'body' | 'mono';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type TextColor = 'primary' | 'secondary' | 'muted' | 'success' | 'error' | 'warning';
export type TextAlign = 'left' | 'center' | 'right';

export interface TextProps {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  gradient?: boolean;
  underlined?: boolean;
  truncate?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  variant = 'body',
  size = 'base',
  weight,
  color,
  align,
  gradient = false,
  underlined = false,
  truncate = false,
  className = '',
  children,
}) => {
  const classes = [
    'text',
    `text--${variant}`,
    `text--${size}`,
    weight && `text--${weight}`,
    color && `text--${color}`,
    align && `text--${align}`,
    gradient && 'text--gradient',
    underlined && 'text--underlined',
    truncate && 'text--truncate',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes}>{children}</Component>;
};

export default Text;
