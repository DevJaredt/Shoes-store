import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '@/components';
import { LogIn, CheckCircle2 } from 'lucide-react';
import type { LoginFormData } from '../types';

interface LocationState {
  from?: { pathname?: string };
  message?: string;
}

export function LoginPage() {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const from = state?.from?.pathname || '/';

  const [form, setForm] = useState<LoginFormData>({
    email: '',
    password: '',
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
      await login(form);
      navigate(from, { replace: true });
    } catch {
      setError(authError || 'Credenciales inválidas');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up rounded-3xl bg-surface p-8 shadow-xl shadow-primary/5 ring-1 ring-border">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
          <LogIn className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-text">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Ingresa tus datos para continuar
        </p>

        {state?.message && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-success/10 p-3 text-sm font-medium text-success animate-fade-in">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {state.message}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoFocus
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <p className="text-sm font-medium text-danger">{error}</p>}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
          >
            Ingresar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="font-semibold text-accent transition hover:text-accent-hover"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
