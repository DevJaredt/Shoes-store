import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/features/cart/context/CartContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { salesApi } from '@/api';
import { getErrorMessage } from '@/api/client';
import { Button, Input, Loading } from '@/components';
import { getColorHex } from '@/utils/helpers';
import { formatCurrency } from '@/utils';
import {
  CreditCard,
  Banknote,
  Landmark,
  Lock,
  ShoppingBag,
  ArrowRight,
  Tag,
} from 'lucide-react';

const paymentOptions = [
  { value: 'cash', label: 'Efectivo', icon: Banknote },
  { value: 'card', label: 'Tarjeta', icon: CreditCard },
  { value: 'transfer', label: 'Transferencia', icon: Landmark },
] as const;

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-text-secondary">
            <Lock className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-text">Inicia sesión</h1>
          <p className="mt-2 text-text-secondary">
            Debes iniciar sesión para completar la compra
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.97]"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await salesApi.create({
        items: items.map((item) => ({
          product: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        discount,
        paymentMethod,
      });

      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-text-secondary">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-text">Tu carrito está vacío</h1>
          <p className="mt-2 text-text-secondary">Explora el catálogo y encuentra tu par perfecto</p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.97]"
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
          <CreditCard className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Checkout</span>
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-text">Finalizar compra</h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-surface p-6 shadow-lg shadow-primary/5 ring-1 ring-border">
          <h2 className="text-lg font-black text-text">Resumen del pedido</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex items-center justify-between border-b border-border py-3 text-sm"
              >
                <span className="flex items-center gap-2 text-text-secondary">
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: getColorHex(item.color) }}
                  />
                  {item.productName} · Talla {item.size} x{item.quantity}
                </span>
                <span className="font-bold text-text">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-b border-border pb-4 text-sm font-medium text-text-secondary">
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              Descuento
            </span>
            <span>-{formatCurrency(discount)}</span>
          </div>
          <div className="mt-4 flex justify-between text-2xl font-black text-text">
            <span>Total</span>
            <span>{formatCurrency(totalPrice - discount)}</span>
          </div>
        </div>

        <form
          className="space-y-5 rounded-3xl bg-surface p-6 shadow-lg shadow-primary/5 ring-1 ring-border"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="text-sm font-semibold text-text-secondary">Método de pago</label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {paymentOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPaymentMethod(value)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-sm font-bold transition-all ${
                    paymentMethod === value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-surface text-text-secondary hover:border-text-secondary hover:text-text'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Descuento"
            type="number"
            min={0}
            max={totalPrice}
            value={discount}
            onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
          />

          {error && <p className="text-sm font-medium text-danger">{error}</p>}

          <Button type="submit" variant="accent" size="lg" fullWidth isLoading={isSubmitting}>
            {isSubmitting ? <Loading message="Procesando..." /> : 'Confirmar compra'}
          </Button>
        </form>
      </div>
    </div>
  );
}
