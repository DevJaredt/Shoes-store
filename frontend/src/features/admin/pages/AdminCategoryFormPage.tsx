import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { categoriesApi } from '@/api';
import { Button, Input, Loading, ErrorMessage } from '@/components';
import type { Category } from '@/types';

export function AdminCategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { createCategory, updateCategory } = useAdminCategories();

  const [form, setForm] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    categoriesApi
      .getById(id)
      .then((category: Category) => {
        setForm({ name: category.name, description: category.description });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar la categoría'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (isEditing && id) {
        await updateCategory(id, form);
      } else {
        await createCategory(form);
      }
      navigate('/admin/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la categoría');
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
        {isEditing ? 'Editar categoría' : 'Nueva categoría'}
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
          label="Descripción"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <Link
            to="/admin/categories"
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
