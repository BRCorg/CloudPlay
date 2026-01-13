import React from 'react';
import './avatar.scss';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  shape?: 'square' | 'circle';
  fallback?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'medium',
  shape = 'circle',
  fallback,
  className = '',
}) => {
  const classNames = [
    'avatar',
    `avatar--${size}`,
    `avatar--${shape}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {src ? (
        <img src={src} alt={alt} className="avatar__image" />
      ) : (
        <div className="avatar__fallback">
          {fallback || alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
