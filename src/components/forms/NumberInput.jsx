/**
 * Renders a Bootstrap-styled numeric input and forwards native input props.
 *
 * @param {object} props Component props.
 * @param {string} [props.className=''] Additional class names appended to the input.
 * @returns {JSX.Element} A number input control.
 */
export default function NumberInput({ className = '', ...props }) {
  return (
    <input
      className={`form-control form-control-sm ${className}`.trim()}
      type="number"
      {...props}
    />
  );
}
