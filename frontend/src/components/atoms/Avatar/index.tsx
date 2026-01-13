import "./avatar.scss";

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
};

const Avatar = ({ src, alt = "Avatar", size = "md" }: AvatarProps) => {
  return (
    <div className={`avatar avatar--${size}`}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <span className="avatar__fallback">
          {alt[0].toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default Avatar;
