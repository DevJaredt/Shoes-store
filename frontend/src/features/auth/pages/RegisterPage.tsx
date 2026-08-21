import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '@/components';
import { UserPlus } from 'lucide-react';
import type { RegisterFormData } from '../types';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    document: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await register(form);
      navigate('/login', {
        replace: true,
        state: { message: 'Cuenta creada. Inicia sesión con tus credenciales.' },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in-up rounded-3xl bg-surface p-8 shadow-xl shadow-primary/5 ring-1 ring-border">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <UserPlus className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-text">
          Crear cuenta
        </h1>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Únete y encuentra tu par perfecto
        </p>

        <form className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Input
            className="sm:col-span-2"
            label="Nombre completo"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            className="sm:col-span-2"
            label="Correo electrónico"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            className="sm:col-span-2"
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Documento"
            type="text"
            name="document"
            value={form.document}
            onChange={handleChange}
            required
          />
          <Input
            label="Teléfono"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          {error && (
            <p className="text-sm font-medium text-danger sm:col-span-2">{error}</p>
          )}
          <div className="sm:col-span-2">
            <Button type="submit" variant="accent" size="lg" fullWidth isLoading={isSubmitting}>
              Registrarse
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-accent transition hover:text-accent-hover"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
