import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-muted p-8 ring-1 ring-border sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-black uppercase tracking-tight text-text sm:text-4xl">
            Únete al club
          </h2>
          <p className="mt-3 text-text-secondary">
            Recibe lanzamientos exclusivos, descuentos y consejos de estilo directo en tu correo.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="Tu correo electrónico"
              className="flex-1 rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm font-medium text-text outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <button
              type="submit"
              className="rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-text-secondary active:scale-[0.98]"
            >
              Suscribirme
            </button>
          </form>

          {status === 'success' && (
            <div className="mt-4 flex animate-fade-in items-center justify-center gap-2 text-sm font-bold text-success">
              <CheckCircle className="h-4 w-4" />
              ¡Gracias por suscribirte!
            </div>
          )}
          {status === 'error' && (
            <p className="mt-4 text-sm font-bold text-danger">
              Por favor ingresa un correo válido.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
