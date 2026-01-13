import "./InputTextArea.scss";

type TextareaProps = {
  error?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({ error, ...props }: TextareaProps) => {
  return (
    <textarea
      className={`textarea${error ? " textarea--error" : ""}`}
      {...props}
    />
  );
};

export default Textarea;
