import { Link } from 'react-router-dom';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { Loading, ErrorMessage, Button } from '@/components';

export function AdminCategoriesPage() {
  const { categories, isLoading, error, refetch, deleteCategory } = useAdminCategories();

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    await deleteCategory(id);
  };

  if (isLoading) {
    return <Loading message="Cargando categorías..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black tracking-tight text-text">Categorías</h1>
        <Link
          to="/admin/categories/new"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]"
        >
          Nueva categoría
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-3xl bg-surface py-16 text-center text-text-secondary ring-1 ring-border">
          <p className="text-lg font-bold text-text">No hay categorías registradas</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-bold">Nombre</th>
                  <th className="px-6 py-4 font-bold">Descripción</th>
                  <th className="px-6 py-4 font-bold">Estado</th>
                  <th className="px-6 py-4 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr key={category._id} className="transition hover:bg-muted/50">
                    <td className="px-6 py-4 font-bold text-text">{category.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{category.description}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          category.active
                            ? 'bg-success/10 text-success'
                            : 'bg-danger/10 text-danger'
                        }`}
                      >
                        {category.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/categories/${category._id}/edit`}
                          className="rounded-full bg-muted px-3 py-1.5 text-sm font-bold text-text-secondary transition hover:bg-border hover:text-text"
                        >
                          Editar
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(category._id)}>
                          Desactivar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
