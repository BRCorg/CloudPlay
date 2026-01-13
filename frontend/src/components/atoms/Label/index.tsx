import React from 'react';
import './label.scss';

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  optional = false,
  htmlFor,
  className = '',
}) => {
  const classNames = [
    'label',
    required && 'label--required',
    optional && 'label--optional',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label htmlFor={htmlFor} className={classNames}>
      {children}
    </label>
  );
};

export default Label;
