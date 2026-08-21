import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { usersApi } from '@/api';
import { Button, Input, Select, Loading, ErrorMessage } from '@/components';
import type { User } from '@/types';

export function AdminUserFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { createUser, updateUser } = useAdminUsers();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    document: '',
    phone: '',
    role: 'customer' as 'admin' | 'customer',
  });
  const [isLoading, setIsLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    usersApi
      .getById(id)
      .then((user: User) => {
        setForm({
          name: user.name,
          email: user.email,
          password: '',
          document: user.document,
          phone: user.phone,
          role: user.role,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar el usuario'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = { ...form };
    if (isEditing && !payload.password) {
      delete (payload as { password?: string }).password;
    }

    try {
      if (isEditing && id) {
        await updateUser(id, payload);
      } else {
        await createUser(payload as Required<typeof payload>);
      }
      navigate('/admin/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading message="Cargando..." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight text-text">
        {isEditing ? 'Editar usuario' : 'Nuevo usuario'}
      </h1>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-2xl space-y-5 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border"
      >
        <Input label="Nombre" name="name" value={form.name} onChange={handleChange} required />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label={isEditing ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required={!isEditing}
        />
        <Input
          label="Documento"
          name="document"
          value={form.document}
          onChange={handleChange}
          required
        />
        <Input
          label="Teléfono"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <Select label="Rol" name="role" value={form.role} onChange={handleChange} required>
          <option value="customer">Cliente</option>
          <option value="admin">Administrador</option>
        </Select>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <Link
            to="/admin/users"
            className="inline-flex items-center justify-center rounded-full border-2 border-border bg-surface px-6 py-2.5 text-sm font-bold text-text-secondary transition hover:border-text-secondary hover:bg-muted hover:text-text"
          >
            Cancelar
          </Link>
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
}
