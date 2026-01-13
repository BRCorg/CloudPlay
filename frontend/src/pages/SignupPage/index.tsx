import React, { useState } from 'react';
import { MainLayout } from '../../components/templates/MainLayout';
import { Input } from '../../components/atoms/Input';
import { Label } from '../../components/atoms/Label';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import './signupPage.scss';

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Signup:', formData);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  return (
    <MainLayout className="signup-page">
      <div className="signup-page__container">
        <div className="signup-page__left">
          <div className="signup-page__logo">
            <span>🎮</span> CloudPlay
          </div>
          <Text as="h1" size="4xl" weight="bold" className="signup-page__title">
            Join CloudPlay Today!
          </Text>
          <Text color="muted" size="lg" className="signup-page__subtitle">
            Create your account and start your gaming journey with millions of players worldwide.
          </Text>
          <div className="signup-page__features">
            <div className="signup-page__feature">
              <div className="signup-page__feature-icon">🆓</div>
              <div className="signup-page__feature-text">
                <Text as="h4" weight="semibold">Free to Join</Text>
                <Text size="sm" color="muted">No credit card required</Text>
              </div>
            </div>
            <div className="signup-page__feature">
              <div className="signup-page__feature-icon">⚡</div>
              <div className="signup-page__feature-text">
                <Text as="h4" weight="semibold">Instant Access</Text>
                <Text size="sm" color="muted">Start playing immediately</Text>
              </div>
            </div>
            <div className="signup-page__feature">
              <div className="signup-page__feature-icon">🎁</div>
              <div className="signup-page__feature-text">
                <Text as="h4" weight="semibold">Welcome Bonus</Text>
                <Text size="sm" color="muted">Get 100 points on signup</Text>
              </div>
            </div>
          </div>
        </div>

        <div className="signup-page__right">
          <div className="signup-page__form-container">
            <div className="signup-page__form-header">
              <Text as="h2" size="2xl" weight="bold">Create Account</Text>
              <Text color="muted">Fill in your details to get started</Text>
            </div>

            <form className="signup-page__form" onSubmit={handleSubmit}>
              <div className="signup-page__field">
                <Label htmlFor="username" required>Username</Label>
                <Input
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="signup-page__field">
                <Label htmlFor="email" required>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="signup-page__field">
                <Label htmlFor="password" required>Password</Label>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="signup-page__field">
                <Label htmlFor="confirmPassword" required>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="signup-page__divider">
              <Text as="span" size="sm" color="muted">Or sign up with</Text>
            </div>

            <div className="signup-page__social">
              <Button variant="outline" className="signup-page__social-btn">Google</Button>
              <Button variant="outline" className="signup-page__social-btn">Discord</Button>
            </div>

            <div className="signup-page__login">
              <Text color="muted">
                Already have an account? <a href="/login">Sign in</a>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignupPage;
