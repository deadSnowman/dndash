/**
 * Renders a small labeled checkbox that reports boolean values to its parent.
 *
 * @param {object} props Component props.
 * @param {boolean} props.checked Whether the checkbox is checked.
 * @param {string} props.label Label text displayed beside the checkbox.
 * @param {(checked: boolean) => void} props.onChange Handler called with the next checked state.
 * @returns {JSX.Element} A checkbox control with its label.
 */
export default function CheckboxField({ checked, label, onChange }) {
  return (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />{' '}
      <label className="col-form-label text-fix">{label}</label>
    </div>
  );
}
