import "./likeButton.scss";
import LikeIcon from "../../atoms/LikeIcon";
import Button from "../../atoms/Button";

// Type des props du composant LikeButton
export type LikeButtonProps = {
  liked: boolean;
  iconOnly?: boolean;
  onToggle: (next: boolean) => void;
};

// Composant LikeButton pour gérer les likes
const LikeButton = ({ liked, iconOnly = false, onToggle }: LikeButtonProps) => {
  // Gestion du clic sur le bouton
  const handleClick = () => onToggle(!liked);

  return (
    <Button
      type="button"
      className={`like-button ${liked ? "like-button--liked" : ""} ${iconOnly ? "like-button--icon-only" : ""
        }`.trim()}
      onClick={handleClick}
      variant={liked ? "primary" : "secondary"}
      size={iconOnly ? "sm" : undefined}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <LikeIcon liked={liked} />
    </Button>
  );
};

export default LikeButton;
