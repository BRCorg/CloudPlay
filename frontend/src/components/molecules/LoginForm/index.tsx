import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Label } from '../../atoms/Label';
import { Text } from '../../atoms/Text';
import { Spinner } from '../../atoms/Spinner';
import './loginForm.scss';

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
  error?: string;
  isLoading?: boolean;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  error,
  isLoading = false,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(email, password);
  };

  return (
    <form className={`login-form ${className}`} onSubmit={handleSubmit}>
      <div className="login-form__header">
        <Text as="h2" size="2xl" weight="bold" className="login-form__title">
          Welcome Back
        </Text>
        <Text color="muted" className="login-form__subtitle">
          Sign in to continue
        </Text>
      </div>

      {error && (
        <Text color="error" className="login-form__error">{error}</Text>
      )}

      <div className="login-form__field">
        <Label htmlFor="email" required>Email</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
        />
      </div>

      <div className="login-form__field">
        <Label htmlFor="password" required>Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!error}
        />
      </div>

      <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
        {isLoading ? <><Spinner size="small" variant="light" /> Signing in...</> : 'Sign In'}
      </Button>

      <div className="login-form__footer">
        <Text color="muted" className="login-form__link">
          Don't have an account? <a href="/signup">Sign up</a>
        </Text>
      </div>
    </form>
  );
};

export default LoginForm;
