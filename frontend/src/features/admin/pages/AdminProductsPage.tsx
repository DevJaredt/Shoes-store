import { Link } from 'react-router-dom';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { Loading, ErrorMessage, Button } from '@/components';
import { formatCurrency } from '@/utils';
import { getProductCategoryName } from '@/utils/helpers';

export function AdminProductsPage() {
  const { products, isLoading, error, refetch, deleteProduct } = useAdminProducts();

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    await deleteProduct(id);
  };

  if (isLoading) {
    return <Loading message="Cargando productos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black tracking-tight text-text">Productos</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]"
        >
          Nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl bg-surface py-16 text-center text-text-secondary ring-1 ring-border">
          <p className="text-lg font-bold text-text">No hay productos registrados</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-bold">Nombre</th>
                  <th className="px-6 py-4 font-bold">Marca</th>
                  <th className="px-6 py-4 font-bold">Categoría</th>
                  <th className="px-6 py-4 font-bold">Precio</th>
                  <th className="px-6 py-4 font-bold">Variantes</th>
                  <th className="px-6 py-4 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product._id} className="transition hover:bg-muted/50">
                    <td className="px-6 py-4 font-bold text-text">{product.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{product.brand}</td>
                    <td className="px-6 py-4 text-text-secondary">
                      {getProductCategoryName(product.category)}
                    </td>
                    <td className="px-6 py-4 font-bold text-text">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{product.variants.length}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="rounded-full bg-muted px-3 py-1.5 text-sm font-bold text-text-secondary transition hover:bg-border hover:text-text"
                        >
                          Editar
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(product._id)}>
                          Eliminar
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
