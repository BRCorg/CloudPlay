import React, { useState } from 'react';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import './searchBar.scss';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onClear?.();
    onChange?.('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <div className={`search-bar ${className}`}>
      <form onSubmit={handleSubmit} className="search-bar__wrapper">
        <Input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        <svg className="search-bar__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
          <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="small"
            className="search-bar__clear"
            onClick={handleClear}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
