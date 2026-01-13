import { useState } from "react";
import "./loginPage.scss";

import MainLayout from "../../components/templates/MainLayout";
import LoginForm from "../../components/molecules/LoginForm";

const LoginPage = () => {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (email: string, password: string) => {
    setLoading(true);
    setError(undefined);

    console.log("Login:", { email, password });

    setTimeout(() => {
      setLoading(false);
      // setError("Invalid credentials");
    }, 1000);
  };

  return (
    <MainLayout>
      <section className="login-page">
        <div className="login-page__container">
          <div className="login-page__header">
            <p className="login-page__brand">CloudPlay</p>
            <h1 className="login-page__title">Connexion</h1>
          </div>

          <LoginForm onSubmit={handleSubmit} error={error} loading={loading} />
        </div>
      </section>
    </MainLayout>
  );
};

export default LoginPage;
