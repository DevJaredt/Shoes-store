import { Link } from 'react-router-dom';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { Loading, ErrorMessage } from '@/components';
import { ArrowRight } from 'lucide-react';
import { getProductId } from '@/utils/helpers';
import type { Product, Category } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function FeaturedProducts({
  products,
  categories,
  activeCategory,
  onCategoryChange,
  isLoading,
  error,
  refetch,
}: FeaturedProductsProps) {
  const filteredProducts = activeCategory
    ? products.filter((product) => {
        const id = typeof product.category === 'string' ? product.category : product.category._id;
        return id === activeCategory;
      })
    : products;

  const displayedProducts = filteredProducts.slice(0, 8);

  return (
    <section className="bg-muted py-20" id="featured">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Destacados
            </span>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-text sm:text-4xl">
              Lo más buscado
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onCategoryChange(null)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                activeCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary ring-1 ring-border hover:bg-primary hover:text-white'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => onCategoryChange(category._id)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                  activeCategory === category._id
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-secondary ring-1 ring-border hover:bg-primary hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="mt-10">
            <Loading message="Cargando productos..." />
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorMessage message={error} onRetry={refetch} />
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-surface py-16 text-center ring-1 ring-border animate-fade-in">
            <p className="text-lg font-bold text-text">No hay productos disponibles</p>
            <p className="mt-2 text-sm text-text-secondary">
              Prueba seleccionando otra categoría o vuelve más tarde
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayedProducts.map((product, index) => (
              <div
                key={getProductId(product)}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/catalog"
            className="group inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-text-secondary active:scale-[0.98]"
          >
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
