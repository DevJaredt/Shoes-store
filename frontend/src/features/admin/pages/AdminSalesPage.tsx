import { useSales } from '@/features/sales/hooks/useSales';
import { Loading, ErrorMessage } from '@/components';
import { getColorHex } from '@/utils/helpers';
import { formatCurrency, formatDate } from '@/utils';
import { Receipt, Banknote, CreditCard, Landmark } from 'lucide-react';
import type { Sale } from '@/types';

const paymentLabels: Record<string, string> = {
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
  const createdBy = typeof sale.createdBy === 'string' ? sale.createdBy : sale.createdBy.name;
  const PaymentIcon = paymentIcons[sale.paymentMethod] || Receipt;

  return (
    <div className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border transition hover:shadow-md">
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-black text-text">Venta #{sale._id.slice(-6)}</p>
          <p className="text-sm font-medium text-text-secondary">{formatDate(sale.date)}</p>
        </div>
        <span className="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
          <PaymentIcon className="mr-1 inline h-3.5 w-3.5" />
          {paymentLabels[sale.paymentMethod] || sale.paymentMethod}
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

      {sale.discount > 0 && (
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-bold text-danger">
          <span>Descuento</span>
          <span>-{formatCurrency(sale.discount)}</span>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-medium text-text-secondary">
          <p>Cliente: {customer}</p>
          <p>Registrado por: {createdBy}</p>
        </div>
        <span className="text-2xl font-black text-text">{formatCurrency(sale.total)}</span>
      </div>
    </div>
  );
}

export function AdminSalesPage() {
  const { sales, isLoading, error, refetch } = useSales();

  if (isLoading) {
    return <Loading message="Cargando ventas..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight text-text">Ventas</h1>

      {sales.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-surface py-16 text-center text-text-secondary ring-1 ring-border">
          <p className="text-lg font-bold text-text">No hay ventas registradas</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {sales.map((sale) => (
            <SaleCard key={sale._id} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
}
