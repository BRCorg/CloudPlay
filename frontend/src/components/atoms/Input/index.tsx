import "./input.scss";

type InputProps = {
  error?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ error, ...props }: InputProps) => {
  return (
    <input
      className={`input${error ? " input--error" : ""}`}
      {...props}
    />
  );
};

export default Input;
