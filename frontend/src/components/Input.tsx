import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
}

export function Input({
  label,
  error,
  rightElement,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wide text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`w-full rounded-none border bg-surface px-4 py-3 text-sm font-medium text-text shadow-none transition-all duration-200 placeholder:text-text-secondary/50 hover:border-text-secondary focus:border-primary focus:outline-none focus:ring-0 ${
            error
              ? 'border-danger focus:border-danger'
              : 'border-border'
          } ${rightElement ? 'pr-10' : ''}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-sm font-bold text-danger">{error}</span>}
    </div>
  );
}
