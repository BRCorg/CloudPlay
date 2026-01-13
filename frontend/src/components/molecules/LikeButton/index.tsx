import "./likeButton.scss";
import LikeIcon from "../../atoms/LikeIcon";

export type LikeButtonProps = {
  liked: boolean;
  count?: number;
  iconOnly?: boolean;
  onToggle: (next: boolean) => void;
};

const LikeButton = ({ liked, iconOnly = false, onToggle }: LikeButtonProps) => {
  const handleClick = () => onToggle(!liked);

  return (
    <button
      type="button"
      className={`like-button ${liked ? "like-button--liked" : ""} ${iconOnly ? "like-button--icon-only" : ""}`.trim()}
      onClick={handleClick}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <LikeIcon liked={liked} />

    </button>
  );
};

export default LikeButton;
