export function Loading({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
      <p className="mt-4 text-xs font-bold uppercase tracking-wide">{message}</p>
    </div>
  );
}
