import { Link } from 'react-router-dom';
import { landingImages } from '../data/images';
import { ArrowRight, Sparkles } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-white">
      <img
        src={landingImages.promo}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        loading="lazy"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
            <Sparkles className="h-4 w-4" />
            Oferta por tiempo limitado
          </div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
            Hasta 30% de descuento
          </h2>
          <p className="mt-3 max-w-xl text-lg font-medium text-white/80">
            En tu primera compra al registrarte. No dejes pasar la oportunidad de renovar tu
            estilo.
          </p>
        </div>
        <Link
          to="/register"
          className="group inline-flex items-center justify-center gap-2 bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-primary transition hover:bg-muted active:scale-[0.98]"
        >
          Crear cuenta gratis
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
