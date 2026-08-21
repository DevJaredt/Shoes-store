import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';
import { Button } from '@/components';
import { formatCurrency } from '@/utils';
import { ShoppingBag, ArrowRight, AlertTriangle, Tag } from 'lucide-react';

export function CartPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-text-secondary">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-text">Tu carrito está vacío</h1>
          <p className="mt-2 text-text-secondary">
            Explora el catálogo y encuentra tu par perfecto
          </p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.97]"
          >
            Ir al catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-accent">
          <ShoppingBag className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Carrito</span>
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-text">Tu selección</h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} />
          ))}
        </div>

        <div className="h-fit rounded-3xl bg-surface p-6 shadow-lg shadow-primary/5 ring-1 ring-border lg:sticky lg:top-28">
          <h2 className="text-lg font-black text-text">Resumen</h2>
          <div className="mt-4 space-y-3 border-b border-border pb-4">
            <div className="flex justify-between text-sm font-medium text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                Productos
              </span>
              <span>{totalItems}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-2xl font-black text-text">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>

          <Button
            variant="accent"
            size="lg"
            fullWidth
            className="mt-6"
            onClick={handleCheckout}
          >
            Proceder al pago
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            fullWidth
            className="mt-3"
            onClick={() => setShowConfirm(true)}
          >
            Vaciar carrito
          </Button>

          {showConfirm && (
            <div className="mt-4 animate-fade-in rounded-2xl bg-danger/5 p-4 text-center">
              <p className="flex items-center justify-center gap-2 text-sm font-bold text-danger">
                <AlertTriangle className="h-4 w-4" />
                ¿Seguro que deseas vaciar el carrito?
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <Button variant="danger" size="sm" onClick={clearCart}>
                  Sí, vaciar
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
