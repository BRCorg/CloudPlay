import "./avatar.scss";


type AvatarProps = {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Avatar = ({ src, alt = "Avatar", size = "md", className = "" }: AvatarProps) => {
  return (
    <div className={`avatar avatar--${size} ${className}`.trim()}>
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
