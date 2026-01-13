import React from 'react';
import './input.scss';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  error?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  multiline = false,
  rows = 3,
  className = '',
}) => {
  const classNames = [
    'input',
    error && 'input--error',
    multiline && 'input--textarea',
    className,
  ].filter(Boolean).join(' ');

  if (multiline) {
    return (
      <textarea
        className={classNames}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
      />
    );
  }

  return (
    <input
      type={type}
      className={classNames}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

export default Input;
