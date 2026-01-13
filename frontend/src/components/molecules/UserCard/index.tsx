import "./userCard.scss";
import Avatar from "../../atoms/Avatar";

export type UserCardProps = {
  name: string;
  username: string;
  avatar?: string;
  onOpen?: () => void;
};

const UserCard = ({ name, username, avatar, onOpen }: UserCardProps) => {
  const content = (
    <>
      <Avatar src={avatar} alt={name} size="sm" />

      <div className="user-card__info">
        <p className="user-card__name">{name}</p>
        <span className="user-card__username">@{username}</span>
      </div>
    </>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        className="user-card user-card--clickable"
        onClick={onOpen}
      >
        {content}
      </button>
    );
  }

  return <div className="user-card">{content}</div>;
};

export default UserCard;
