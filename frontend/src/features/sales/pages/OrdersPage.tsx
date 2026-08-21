import { useSales } from '../hooks/useSales';
import { Loading, ErrorMessage } from '@/components';
import { getColorHex } from '@/utils/helpers';
import { formatCurrency, formatDate } from '@/utils';
import { Receipt, Banknote, CreditCard, Landmark } from 'lucide-react';
import type { Sale } from '@/types';

const paymentLabel: Record<string, string> = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
};

const paymentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  cash: Banknote,
  card: CreditCard,
  transfer: Landmark,
};

function SaleCard({ sale }: { sale: Sale }) {
  const customer = typeof sale.customer === 'string' ? sale.customer : sale.customer.name;
  const PaymentIcon = paymentIcons[sale.paymentMethod] || Receipt;

  return (
    <div className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border transition hover:shadow-md">
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div>
          <p className="font-black text-text">Pedido #{sale._id.slice(-6)}</p>
          <p className="text-sm font-medium text-text-secondary">{formatDate(sale.date)}</p>
        </div>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
          <PaymentIcon className="mr-1 inline h-3.5 w-3.5" />
          {paymentLabel[sale.paymentMethod] || sale.paymentMethod}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {sale.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-text-secondary">
              <span
                className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: getColorHex(item.color) }}
              />
              {item.nameSnapshot || 'Producto'} · Talla {item.size} x{item.quantity}
            </span>
            <span className="font-bold text-text">{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-text-secondary">Cliente: {customer}</span>
        <span className="text-2xl font-black text-text">{formatCurrency(sale.total)}</span>
      </div>
    </div>
  );
}

export function OrdersPage() {
  const { sales, isLoading, error, refetch } = useSales();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Loading message="Cargando pedidos..." />
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
      <header className="mb-8">
        <div className="flex items-center gap-2 text-accent">
          <Receipt className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Pedidos</span>
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-text">Mis pedidos</h1>
      </header>

      {sales.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-surface py-16 text-center ring-1 ring-border">
          <p className="text-lg font-bold text-text">No tienes pedidos registrados</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {sales.map((sale) => (
            <SaleCard key={sale._id} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
}
