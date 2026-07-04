export default function NumberInput({ className = '', ...props }) {
  return (
    <input
      className={`form-control form-control-sm ${className}`.trim()}
      type="number"
      {...props}
    />
  );
}
