import "./userProfile.scss";
import Avatar from "../../atoms/Avatar";

export type UserProfileProps = {
  user: {
    name: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
};

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <section className="user-profile">
      <Avatar src={user.avatar} alt={user.name} size="lg" />

      <div className="user-profile__info">
        <h1 className="user-profile__name">{user.name}</h1>
        <p className="user-profile__username">@{user.username}</p>

        {user.bio && <p className="user-profile__bio">{user.bio}</p>}
      </div>
    </section>
  );
};

export default UserProfile;
