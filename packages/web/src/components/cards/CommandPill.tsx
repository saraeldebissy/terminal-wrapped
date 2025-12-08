/**
 * Styled command pill/badge
 */

export interface CommandPillProps {
  command: string;
  count?: number;
  variant?: 'default' | 'highlight' | 'muted';
  className?: string;
}

const variantClasses = {
  default: 'bg-slate-700/50 text-slate-200',
  highlight: 'bg-primary/20 text-primary border border-primary/30',
  muted: 'bg-slate-800/50 text-slate-400',
};

export function CommandPill({
  command,
  count,
  variant = 'default',
  className = '',
}: CommandPillProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-2 font-mono text-sm
        px-3 py-1.5 rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <span className="truncate max-w-[200px]">{command}</span>
      {count !== undefined && (
        <span className="text-xs text-slate-400">×{count.toLocaleString()}</span>
      )}
    </span>
  );
}
