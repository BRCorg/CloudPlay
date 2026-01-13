import React, { useState } from 'react';
import { MainLayout } from '../../components/templates/MainLayout';
import { LoginForm } from '../../components/molecules/LoginForm';
import { Text } from '../../components/atoms/Text';
import './loginPage.scss';

export const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);
    console.log('Login:', { email, password });
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <MainLayout className="login-page">
      <div className="login-page__container">
        <div className="login-page__left">
          <div className="login-page__logo">
            <span>🎮</span> CloudPlay
          </div>
          <Text as="h1" size="4xl" weight="bold" className="login-page__title">
            Welcome back to CloudPlay!
          </Text>
          <Text color="muted" size="lg" className="login-page__subtitle">
            Join millions of gamers worldwide. Play, compete, and discover your next favorite game.
          </Text>
          <div className="login-page__features">
            <div className="login-page__feature">
              <div className="login-page__feature-icon">🎯</div>
              <div className="login-page__feature-text">
                <Text as="h4" weight="semibold">Thousands of Games</Text>
                <Text size="sm" color="muted">Access our entire game library</Text>
              </div>
            </div>
            <div className="login-page__feature">
              <div className="login-page__feature-icon">👥</div>
              <div className="login-page__feature-text">
                <Text as="h4" weight="semibold">Global Community</Text>
                <Text size="sm" color="muted">Connect with gamers worldwide</Text>
              </div>
            </div>
            <div className="login-page__feature">
              <div className="login-page__feature-icon">🏆</div>
              <div className="login-page__feature-text">
                <Text as="h4" weight="semibold">Achievements & Rewards</Text>
                <Text size="sm" color="muted">Earn rewards as you play</Text>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-page__right">
          <div className="login-page__form-container">
            <LoginForm
              onSubmit={handleSubmit}
              error={error}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
