import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-none bg-surface shadow-none ring-1 ring-border transition-all duration-300 ${
        onClick
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:ring-primary/20'
          : ''
      } ${className}`}
      onClick={onClick}
      role="presentation"
    >
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
}

export function CardImage({ src, alt }: CardImageProps) {
  return (
    <div className="aspect-square overflow-hidden bg-muted">
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
}

export function CardBody({ children }: CardBodyProps) {
  return <div className="p-5">{children}</div>;
}
