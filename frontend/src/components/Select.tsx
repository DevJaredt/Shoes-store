import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({
  label,
  error,
  className = '',
  children,
  id,
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-bold uppercase tracking-wide text-text-secondary">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full appearance-none rounded-none border bg-surface px-4 py-3 text-sm font-medium text-text shadow-none transition-all duration-200 hover:border-text-secondary focus:border-primary focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-muted ${
          error
            ? 'border-danger focus:border-danger'
            : 'border-border'
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-sm font-bold text-danger">{error}</span>}
    </div>
  );
}
