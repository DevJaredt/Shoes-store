import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
}

function StatItem({ value, suffix = '', label }: StatItemProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.5 });
  const count = useCountUp(isInView ? value : 0, 1800);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl font-black text-text sm:text-6xl">
        {count}
        {suffix}
      </div>
      <p className="mt-2 text-sm font-bold uppercase tracking-widest text-text-secondary">
        {label}
      </p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="bg-surface py-20 ring-1 ring-border">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        <StatItem value={12} suffix="+" label="Marcas" />
        <StatItem value={350} suffix="+" label="Productos" />
        <StatItem value={2800} suffix="+" label="Clientes" />
        <StatItem value={98} suffix="%" label="Satisfacción" />
      </div>
    </section>
  );
}
