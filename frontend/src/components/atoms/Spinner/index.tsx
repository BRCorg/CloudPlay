import "./spinner.scss";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
};

const Spinner = ({ size = "md" }: SpinnerProps) => {
  return <span className={`spinner spinner--${size}`} aria-label="Loading" />;
};

export default Spinner;
