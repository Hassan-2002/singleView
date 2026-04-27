import { FaCheckCircle } from 'react-icons/fa';

interface SectionCardProps {
  number: number;
  title: string;
  isCompleted?: boolean;
  isExpanded?: boolean;
  onEdit?: () => void;
  onToggle?: () => void;
  children?: React.ReactNode;
}

const SectionCard = ({
  number,
  title,
  isCompleted = false,
  isExpanded = false,
  onEdit,
  onToggle,
  children,
}: SectionCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div
        className={`flex items-center justify-between px-6 py-4 ${!isCompleted && onToggle ? 'cursor-pointer hover:bg-gray-50 transition-colors rounded-xl' : ''}`}
        onClick={!isCompleted ? onToggle : undefined}
      >
        <div className="flex items-center gap-4">
          {isCompleted ? (
            <FaCheckCircle className="w-7 h-7 text-success shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-sidebar-active">{number}</span>
            </div>
          )}
          <h2 className="text-base font-semibold text-text-dark">{title}</h2>
        </div>

        {isCompleted && onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-sm text-sidebar-active hover:text-primary font-medium cursor-pointer transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {isExpanded && children && (
        <div className="px-6 pb-6" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionCard;
