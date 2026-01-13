import "./button.scss";

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`button button--${variant} button--${size}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
