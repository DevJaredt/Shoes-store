import { useEffect, useState } from 'react';
import { testimonials } from '../data/images';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((current + 1) % testimonials.length);

  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Opiniones
          </span>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-text sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-border sm:p-12">
          <Quote className="absolute right-6 top-6 h-12 w-12 text-border" />

          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-full flex-shrink-0 px-2 text-center sm:px-8"
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-border"
                  loading="lazy"
                />
                <p className="mt-6 text-lg font-medium italic text-text-secondary sm:text-xl">
                  "{testimonial.comment}"
                </p>
                <div className="mt-6">
                  <p className="font-black uppercase tracking-wide text-text">{testimonial.name}</p>
                  <p className="text-sm font-medium text-text-secondary">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-text transition hover:bg-primary hover:text-white"
              aria-label="Anterior testimonio"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === current ? 'w-8 bg-primary' : 'w-2.5 bg-border hover:bg-text-secondary'
                  }`}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-text transition hover:bg-primary hover:text-white"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
