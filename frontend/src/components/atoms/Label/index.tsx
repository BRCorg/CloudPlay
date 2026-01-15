import "./label.scss";


type LabelProps = {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

const Label = ({ htmlFor, required, children, className = "" }: LabelProps) => {
  return (
    <label className={`label ${className}`.trim()} htmlFor={htmlFor}>
      {children}
      {required && <span className="label__required">*</span>}
    </label>
  );
};

export default Label;
