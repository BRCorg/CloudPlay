
import React, { useState } from "react";
import "./loginForm.scss";

import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Label from "../../atoms/Label";
import Text from "../../atoms/Text";
import Spinner from "../../atoms/Spinner";

import type { ApiError } from "../../../redux/auth/types";
import { getFieldError } from "../../../utils/getFieldError";

type LoginFormProps = {
  onSubmit: (email: string, password: string) => void;
  error?: string | string[] | ApiError | null;
  loading?: boolean;
};


const LoginForm = ({ onSubmit, error, loading = false }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // DEBUG: Affiche la structure des erreurs de champ reçues du backend
  if (error && typeof error === 'object' && 'details' in error && Array.isArray((error as ApiError).details)) {
    console.log('LoginForm error.details:', (error as ApiError).details);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const hasGlobalError = Boolean(error && (typeof error === "string" || Array.isArray(error)));

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <header className="login-form__header">
        <Text muted>Accédez à votre espace CloudPlay</Text>
      </header>

      {hasGlobalError && (
        <div className="login-form__error" role="alert">
          {Array.isArray(error)
            ? error.map((errMsg, idx) => <div key={idx}>{errMsg}</div>)
            : (error as string)}
        </div>
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
          error={!!getFieldError(error ?? null, 'email')}
          required
        />
        {getFieldError(error ?? null, 'email') && (
          <div className="login-form__field-error" role="alert">
            {getFieldError(error ?? null, 'email')}
          </div>
        )}
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
          error={!!getFieldError(error ?? null, 'password')}
          required
        />
        {getFieldError(error ?? null, 'password') && (
          <div className="login-form__field-error" role="alert">
            {getFieldError(error ?? null, 'password')}
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        <span className="login-form__submit">
          {loading && <Spinner size="sm" />}
          {loading ? "Signing in..." : "Sign In"}
        </span>
      </Button>

      {/* Affichage d'erreur global possible en bas (ex: identifiants invalides) */}
      {typeof error === 'object' && error && !Array.isArray(error) && !('details' in error) && (error as ApiError).error && (
        <div className="login-form__error-global" role="alert">
          {(error as ApiError).error}
        </div>
      )}

      <footer className="login-form__footer">
        <Text muted>
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </Text>
      </footer>
    </form>
  );
};

export default LoginForm;
