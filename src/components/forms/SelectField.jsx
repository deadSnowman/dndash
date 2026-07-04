export default function SelectField({ className = '', children, ...props }) {
  return (
    <select className={`form-control form-control-sm ${className}`.trim()} {...props}>
      {children}
    </select>
  );
}
