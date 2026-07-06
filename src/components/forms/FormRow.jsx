/**
 * Renders a Bootstrap form row with a label column and a control column.
 *
 * @param {object} props Component props.
 * @param {string} [props.label] Optional label text; an empty spacer is rendered when omitted.
 * @param {React.ReactNode} props.children Form control content.
 * @param {string} [props.labelWidth='col-sm-4'] Bootstrap class for the label column width.
 * @param {string} [props.controlWidth='col-sm-8'] Bootstrap class for the control column width.
 * @returns {JSX.Element} A two-column form row.
 */
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

/**
 * Renders a Bootstrap form-row wrapper for side-by-side controls.
 *
 * @param {object} props Component props.
 * @param {React.ReactNode} props.children Column controls to render.
 * @returns {JSX.Element} A form row container.
 */
export function FormColumns({ children }) {
  return <div className="form-row form-group">{children}</div>;
}
