import React from 'react';
import './likeIcon.scss';

interface LikeIconProps {
  liked?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

export const LikeIcon: React.FC<LikeIconProps> = ({
  liked = false,
  size = 'medium',
  onClick,
  className = '',
}) => {
  const classNames = [
    'like-icon',
    liked && 'like-icon--liked',
    size !== 'medium' && `like-icon--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default LikeIcon;
