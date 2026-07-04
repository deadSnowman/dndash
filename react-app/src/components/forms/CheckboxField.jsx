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
