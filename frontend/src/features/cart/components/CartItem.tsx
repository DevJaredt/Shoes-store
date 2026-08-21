import { useCart } from '../context/CartContext';
import { formatCurrency } from '@/utils';
import { getColorHex } from '@/utils/helpers';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex animate-fade-in-up flex-col gap-4 rounded-3xl bg-surface p-4 shadow-sm ring-1 ring-border transition-all hover:shadow-md sm:flex-row sm:items-center">
      <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
        <img
          src={item.image || '/placeholder-shoe.svg'}
          alt={item.productName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-text">{item.productName}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-medium text-text-secondary">
          <span className="rounded-lg bg-muted px-2 py-0.5">Talla {item.size}</span>
          <span className="flex items-center gap-1.5 rounded-lg bg-muted px-2 py-0.5">
            <span
              className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: getColorHex(item.color) }}
            />
            {item.color}
          </span>
        </div>
        <p className="mt-2 font-semibold text-text">{formatCurrency(item.unitPrice)} c/u</p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="flex items-center rounded-2xl border border-border bg-surface shadow-sm">
          <button
            type="button"
            onClick={() =>
              updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
            }
            className="flex h-9 w-9 items-center justify-center rounded-l-2xl text-text-secondary transition hover:bg-muted hover:text-text"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex h-9 w-10 items-center justify-center text-sm font-bold text-text">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() =>
              updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
            }
            className="flex h-9 w-9 items-center justify-center rounded-r-2xl text-text-secondary transition hover:bg-muted hover:text-text"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-lg font-black text-text">
            {formatCurrency(item.unitPrice * item.quantity)}
          </p>
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.size, item.color)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition hover:bg-danger/10 hover:text-danger"
            aria-label="Eliminar producto"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
