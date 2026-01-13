import "./badge.scss";

type BadgeProps = {
  variant?: "primary" | "success" | "error" | "warning";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
};

const Badge = ({
  variant = "primary",
  size = "md",
  children,
}: BadgeProps) => {
  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      {children}
    </span>
  );
};

export default Badge;
