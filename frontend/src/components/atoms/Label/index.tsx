import "./label.scss";

type LabelProps = {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
};

const Label = ({ htmlFor, required, children }: LabelProps) => {
  return (
    <label className="label" htmlFor={htmlFor}>
      {children}
      {required && <span className="label__required">*</span>}
    </label>
  );
};

export default Label;
