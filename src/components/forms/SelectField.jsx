/**
 * Renders a Bootstrap-styled select and forwards native select props.
 *
 * @param {object} props Component props.
 * @param {string} [props.className=''] Additional class names appended to the select.
 * @param {React.ReactNode} props.children Option elements to render inside the select.
 * @returns {JSX.Element} A select control.
 */
export default function SelectField({ className = '', children, ...props }) {
  return (
    <select className={`form-control form-control-sm ${className}`.trim()} {...props}>
      {children}
    </select>
  );
}
