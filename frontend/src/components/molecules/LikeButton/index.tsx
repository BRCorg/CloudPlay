import React, { useState } from 'react';
import { LikeIcon } from '../../atoms/LikeIcon';
import { Text } from '../../atoms/Text';
import './likeButton.scss';

export interface LikeButtonProps {
  count?: number;
  isLiked?: boolean;
  onToggle?: (isLiked: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  iconOnly?: boolean;
  className?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  count = 0,
  isLiked: controlledIsLiked,
  onToggle,
  size = 'medium',
  iconOnly = false,
  className = '',
}) => {
  const [internalIsLiked, setInternalIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isLiked = controlledIsLiked !== undefined ? controlledIsLiked : internalIsLiked;

  const handleClick = () => {
    const newIsLiked = !isLiked;

    if (controlledIsLiked === undefined) {
      setInternalIsLiked(newIsLiked);
    }

    if (newIsLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }

    onToggle?.(newIsLiked);
  };

  const classes = [
    'like-button',
    isLiked && 'like-button--liked',
    isAnimating && 'like-button--animating',
    iconOnly && 'like-button--icon-only',
    size !== 'medium' && `like-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} onClick={handleClick}>
      <span className="like-button__icon">
        <LikeIcon liked={isLiked} size={size} />
      </span>
      {!iconOnly && (
        <Text as="span" size="sm" className="like-button__count">
          {count}
        </Text>
      )}
    </button>
  );
};

export default LikeButton;
