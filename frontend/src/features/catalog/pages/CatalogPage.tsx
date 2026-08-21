import { useState, useMemo } from 'react';
import { useCatalog } from '../hooks/useCatalog';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import { Loading, ErrorMessage } from '@/components';
import { SlidersHorizontal } from 'lucide-react';

export function CatalogPage() {
  const { products, categories, isLoading, error, refetch } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory
        ? typeof product.category === 'string'
          ? product.category === selectedCategory
          : product.category._id === selectedCategory
        : true;
      const matchesSearch = search
        ? product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.brand.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Loading message="Cargando catálogo..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-accent">
            <SlidersHorizontal className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Catálogo</span>
          </div>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-text">Zapatos</h1>
          <p className="mt-2 text-text-secondary">
            Explora nuestra colección y encuentra tu par perfecto
          </p>
        </div>
        <p className="text-sm font-semibold text-text-secondary">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
        </p>
      </header>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        search={search}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearch}
      />

      {filteredProducts.length === 0 ? (
        <div className="mt-12 rounded-3xl bg-surface py-20 text-center ring-1 ring-border animate-fade-in">
          <p className="text-lg font-bold text-text">No se encontraron productos</p>
          <p className="mt-2 text-sm text-text-secondary">Prueba ajustando tus filtros de búsqueda</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <div
              key={product._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
