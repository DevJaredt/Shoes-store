import { Zap, ShieldCheck, RefreshCw, HeadphonesIcon } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Envío rápido',
    description: 'Recibe tus zapatos en la puerta de tu casa en tiempo récord.',
  },
  {
    icon: ShieldCheck,
    title: 'Calidad garantizada',
    description: 'Solo trabajamos con marcas originales y materiales de primera.',
  },
  {
    icon: RefreshCw,
    title: 'Devoluciones fáciles',
    description: '¿No es tu talla? Realiza cambios sin complicaciones en 30 días.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Atención personalizada',
    description: 'Nuestro equipo está listo para ayudarte con tu compra.',
  },
];

export function BenefitsSection() {
  return (
    <section className="border-t border-border bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-3xl bg-muted p-8 ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:bg-surface hover:shadow-lg"
            >
              <benefit.icon className="mx-auto h-10 w-10 text-text transition-transform duration-300 group-hover:scale-110" />
              <h3 className="mt-5 text-sm font-black uppercase tracking-widest text-text">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-text-secondary">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
