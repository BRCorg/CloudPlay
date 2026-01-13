import React from 'react';
import './spinner.scss';

export type SpinnerVariant = 'primary' | 'secondary' | 'light' | 'dots' | 'pulse';
export type SpinnerSize = 'small' | 'medium' | 'large';

export interface SpinnerProps {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  variant = 'primary',
  size = 'medium',
  className = '',
}) => {
  const classes = [
    'spinner',
    `spinner--${variant}`,
    size !== 'medium' && `spinner--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (variant === 'dots') {
    return (
      <div className={classes}>
        <div className="spinner__dot" />
        <div className="spinner__dot" />
        <div className="spinner__dot" />
      </div>
    );
  }

  return (
    <div className={classes}>
      <div className="spinner__circle" />
    </div>
  );
};

export default Spinner;
