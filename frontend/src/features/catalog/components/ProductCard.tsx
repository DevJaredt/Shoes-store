import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils';
import {
  getProductId,
  getProductCategoryName,
  getProductImage,
  getColorHex,
  getProductTotalStock,
} from '@/utils/helpers';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const categoryName = getProductCategoryName(product.category);
  const image = getProductImage(product);
  const totalStock = getProductTotalStock(product);

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))].sort((a, b) => a - b);

  return (
    <Link
      to={`/products/${getProductId(product)}`}
      className="group relative block overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:ring-primary/10"
    >
      {totalStock === 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-danger px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
          Agotado
        </span>
      )}

      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="p-5">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">{categoryName}</span>
        <h3 className="mt-1 text-lg font-bold leading-tight text-text transition group-hover:text-accent">
          {product.name}
        </h3>
        <p className="text-sm font-medium text-text-secondary">{product.brand}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {sizes.slice(0, 5).map((size) => (
            <span
              key={size}
              className="rounded-lg bg-muted px-2 py-1 text-xs font-semibold text-text-secondary"
            >
              {size}
            </span>
          ))}
          {sizes.length > 5 && (
            <span className="text-xs font-medium text-text-secondary">+{sizes.length - 5}</span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {colors.slice(0, 6).map((color) => (
            <span
              key={color}
              className="h-4 w-4 rounded-full ring-1 ring-border"
              style={{ backgroundColor: getColorHex(color) }}
              title={color}
            />
          ))}
          {colors.length > 6 && (
            <span className="text-xs font-medium text-text-secondary">+{colors.length - 6}</span>
          )}
        </div>

        <p className="mt-4 text-xl font-bold text-text">{formatCurrency(product.price)}</p>
      </div>
    </Link>
  );
}
