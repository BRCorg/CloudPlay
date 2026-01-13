import React, { useState } from "react";
import "./loginForm.scss";

import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Label from "../../atoms/Label";
import Text from "../../atoms/Text";
import Spinner from "../../atoms/Spinner";

type LoginFormProps = {
  onSubmit: (email: string, password: string) => void;
  error?: string;
  loading?: boolean;
};

const LoginForm = ({ onSubmit, error, loading = false }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const hasError = Boolean(error);

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <header className="login-form__header">
  <Text muted>Accédez à votre espace CloudPlay</Text>

      </header>

      {hasError && (
        <p className="login-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="login-form__field">
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={hasError}
          required
        />
      </div>

      <div className="login-form__field">
        <Label htmlFor="password" required>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={hasError}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        <span className="login-form__submit">
          {loading && <Spinner size="sm" />}
          {loading ? "Signing in..." : "Sign In"}
        </span>
      </Button>

      <footer className="login-form__footer">
        <Text muted>
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </Text>
      </footer>
    </form>
  );
};

export default LoginForm;
