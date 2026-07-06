import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Renders a collapsible dashboard card with an optional controlled collapsed state.
 *
 * @param {object} props Component props.
 * @param {string} props.title Card header text.
 * @param {React.ReactNode} props.children Card body content rendered when expanded.
 * @param {object} [props.dragHandleProps={}] Props supplied by the dashboard drag library for the header handle.
 * @param {boolean} [props.isCollapsed] Controlled collapsed state; omitted for local state.
 * @param {(collapsed: boolean) => void} [props.onCollapsedChange] Handler called after the collapsed state toggles.
 * @returns {JSX.Element} A Bootstrap card that renders children inside its body when expanded.
 */
export default function PluginCard({
  title,
  children,
  dragHandleProps = {},
  isCollapsed: controlledCollapsed,
  onCollapsedChange
}) {
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const isControlled = typeof controlledCollapsed === 'boolean';
  const isCollapsed = isControlled ? controlledCollapsed : localCollapsed;

  /**
   * Switches between expanded and collapsed state while notifying controlled parents.
   *
   * @returns {void}
   */
  const toggleCollapsed = () => {
    const nextCollapsed = !isCollapsed;

    if (!isControlled) {
      setLocalCollapsed(nextCollapsed);
    }

    onCollapsedChange?.(nextCollapsed);
  };

  return (
    <div className="card">
      <div
        className="card-header text-white bg-info handle"
        onDoubleClick={(event) => {
          if (!event.target.closest('.card-toggle')) {
            toggleCollapsed();
          }
        }}
        {...dragHandleProps}
      >
        <strong>{title}</strong>
        <button
          type="button"
          className="card-toggle"
          onPointerDown={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            toggleCollapsed();
          }}
          aria-label={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
        >
          {isCollapsed ? <ChevronRight size={16} strokeWidth={2.4} /> : <ChevronDown size={16} strokeWidth={2.4} />}
        </button>
      </div>
      {!isCollapsed && (
        <div className="card-body">
          <div className="card-text">{children}</div>
        </div>
      )}
    </div>
  );
}
