import React from 'react';
import { Text } from '../../atoms/Text';
import './footer.scss';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`footer ${className}`}>
      <div className="footer__container">
        <div className="footer__content">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">C</div>
              <Text as="span" weight="bold" size="lg" className="footer__logo-text">
                CloudPlay
              </Text>
            </div>
            <Text color="muted" className="footer__tagline">
              Connect, share, and discover amazing content with your community.
            </Text>
          </div>

          {/* Links */}
          <div className="footer__section">
            <Text as="h4" weight="semibold" className="footer__title">
              Product
            </Text>
            <ul className="footer__links">
              <li><a href="/features" className="footer__link">Features</a></li>
              <li><a href="/pricing" className="footer__link">Pricing</a></li>
              <li><a href="/about" className="footer__link">About</a></li>
            </ul>
          </div>

          <div className="footer__section">
            <Text as="h4" weight="semibold" className="footer__title">
              Support
            </Text>
            <ul className="footer__links">
              <li><a href="/help" className="footer__link">Help Center</a></li>
              <li><a href="/contact" className="footer__link">Contact</a></li>
              <li><a href="/faq" className="footer__link">FAQ</a></li>
            </ul>
          </div>

          <div className="footer__section">
            <Text as="h4" weight="semibold" className="footer__title">
              Legal
            </Text>
            <ul className="footer__links">
              <li><a href="/privacy" className="footer__link">Privacy</a></li>
              <li><a href="/terms" className="footer__link">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <Text size="sm" color="muted" className="footer__copyright">
            © 2024 CloudPlay. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
