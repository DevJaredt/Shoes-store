import type { ReactNode } from 'react';

interface ErrorMessageProps {
  message: ReactNode;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-none border border-danger/10 bg-danger/5 p-6 text-center text-danger">
      <p className="font-bold">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 bg-danger px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-all hover:bg-red-800 active:scale-[0.98]"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
