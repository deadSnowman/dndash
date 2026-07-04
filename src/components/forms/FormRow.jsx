export function FormRow({ label, children, labelWidth = 'col-sm-4', controlWidth = 'col-sm-8' }) {
  return (
    <div className="form-group row">
      {label ? (
        <label className={`${labelWidth} control-label`}>{label}</label>
      ) : (
        <span className={`${labelWidth} control-label`} />
      )}
      <div className={controlWidth}>{children}</div>
    </div>
  );
}

export function FormColumns({ children }) {
  return <div className="form-row form-group">{children}</div>;
}
