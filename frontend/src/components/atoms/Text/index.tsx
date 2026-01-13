import "./text.scss";

type TextProps = {
  muted?: boolean;
  children: React.ReactNode;
};

const Text = ({ muted, children }: TextProps) => {
  return (
    <p className={muted ? "text text--muted" : "text"}>
      {children}
    </p>
  );
};

export default Text;
