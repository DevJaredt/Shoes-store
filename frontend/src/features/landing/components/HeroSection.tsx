import { Link } from 'react-router-dom';
import { landingImages } from '../data/images';
import { ArrowRight, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url(${landingImages.hero})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-surface/30" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            Nueva colección 2026
          </span>
          <h1 className="mt-6 text-balance text-5xl font-black uppercase leading-[0.9] tracking-tight text-text sm:text-6xl lg:text-7xl">
            Encuentra
            <br />
            tu par perfecto
          </h1>
          <p className="mt-6 max-w-md text-lg font-medium text-text-secondary">
            Diseño, comodidad y estilo en cada paso. Explora nuestra colección de zapatillas
            seleccionadas para ti.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/catalog"
              className="group inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-text-secondary active:scale-[0.98]"
            >
              Ver catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center border-2 border-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-text transition hover:bg-primary hover:text-white active:scale-[0.98]"
            >
              Crear cuenta
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl bg-surface/80 p-4 ring-1 ring-border backdrop-blur-sm transition hover:-translate-y-1">
              <Truck className="h-6 w-6 text-text" />
              <div>
                <p className="text-xs font-bold uppercase text-text">Envío rápido</p>
                <p className="text-xs font-medium text-text-secondary">A todo el país</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-surface/80 p-4 ring-1 ring-border backdrop-blur-sm transition hover:-translate-y-1">
              <ShieldCheck className="h-6 w-6 text-text" />
              <div>
                <p className="text-xs font-bold uppercase text-text">Garantía real</p>
                <p className="text-xs font-medium text-text-secondary">Productos originales</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-surface/80 p-4 ring-1 ring-border backdrop-blur-sm transition hover:-translate-y-1">
              <RotateCcw className="h-6 w-6 text-text" />
              <div>
                <p className="text-xs font-bold uppercase text-text">Devoluciones</p>
                <p className="text-xs font-medium text-text-secondary">30 días sin costo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
