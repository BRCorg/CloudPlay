import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import "./loginPage.scss";

import MainLayout from "../../components/templates/MainLayout";
import LoginForm from "../../components/molecules/LoginForm";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const handleSubmit = async (email: string, password: string) => {
    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  const errorMessage = error && typeof error === "object" && error.error 
    ? error.error 
    : typeof error === "string" 
    ? error 
    : undefined;

  return (
    <MainLayout>
      <section className="login-page">
        <div className="login-page__container">
          <div className="login-page__header">
            <p className="login-page__brand">CloudPlay</p>
            <h1 className="login-page__title">Connexion</h1>
          </div>

          <LoginForm onSubmit={handleSubmit} error={errorMessage} loading={loading} />
        </div>
      </section>
    </MainLayout>
  );
};

export default LoginPage;
