import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function PluginCard({ title, children, dragHandleProps = {} }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapsed = () => setIsCollapsed((value) => !value);

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
