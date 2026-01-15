import "./likeIcon.scss";

type LikeIconProps = {
  liked?: boolean;
  onClick?: () => void;
};

const LikeIcon = ({ liked = false, onClick }: LikeIconProps) => {
  return (
    <button
      className={`like-icon ${liked ? "like-icon--liked" : ""}`}
      onClick={onClick}
      aria-label={liked ? "Retirer le like" : "Liker"}
      type="button"
      tabIndex={0}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L4.22 13.45 12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default LikeIcon;
