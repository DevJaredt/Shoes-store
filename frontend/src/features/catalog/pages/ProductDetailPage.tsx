import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { AddToCartForm } from '../components/AddToCartForm';
import { Loading, ErrorMessage } from '@/components';
import { formatCurrency } from '@/utils';
import { getProductCategoryName, getProductImage, getProductTotalStock } from '@/utils/helpers';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error, refetch } = useProduct(id || '');

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Loading message="Cargando producto..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage message={error || 'Producto no encontrado'} onRetry={refetch} />
      </div>
    );
  }

  const categoryName = getProductCategoryName(product.category);
  const image = getProductImage(product);
  const totalStock = getProductTotalStock(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/catalog"
        className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-text-secondary transition hover:text-text"
      >
        <span className="rounded-full bg-surface p-1.5 ring-1 ring-border transition group-hover:bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </span>
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muted to-white p-8 ring-1 ring-border">
          {totalStock === 0 && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-danger px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
              Agotado
            </span>
          )}
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain transition duration-500 hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold uppercase tracking-wider text-accent">
              {categoryName}
            </span>
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-text sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-lg font-medium text-text-secondary">{product.brand}</p>
          <p className="mt-5 leading-relaxed text-text-secondary">{product.description}</p>

          <p className="mt-8 text-4xl font-black text-text">{formatCurrency(product.price)}</p>

          <div className="mt-8 rounded-3xl bg-surface p-6 shadow-lg shadow-primary/5 ring-1 ring-border">
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
