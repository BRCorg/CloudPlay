import "./text.scss";

type TextProps = {
  muted?: boolean;
  className?: string;
  children: React.ReactNode;
};

const Text = ({ muted, className = "", children }: TextProps) => {
  return (
    <p className={["text", muted ? "text--muted" : "", className].filter(Boolean).join(" ")}>
      {children}
    </p>
  );
};

export default Text;
