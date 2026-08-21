import { useState, useMemo } from 'react';
import { useAdminInventory } from '../hooks/useAdminInventory';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { Button, Select, Input, Loading, ErrorMessage } from '@/components';
import { getColorHex } from '@/utils/helpers';
import { formatDate } from '@/utils';
import { getErrorMessage } from '@/api/client';
import { AlertTriangle, Package, CheckCircle2 } from 'lucide-react';

const typeLabels: Record<string, string> = {
  entry: 'Entrada',
  exit: 'Salida',
  adjustment: 'Ajuste',
};

const typeStyles: Record<string, string> = {
  entry: 'bg-success/10 text-success',
  exit: 'bg-danger/10 text-danger',
  adjustment: 'bg-accent/10 text-accent',
};

export function AdminInventoryPage() {
  const { movements, isLoading, error, refetch, createMovement } = useAdminInventory();
  const { products } = useAdminProducts();

  const [form, setForm] = useState({
    product: '',
    type: 'entry' as 'entry' | 'exit' | 'adjustment',
    size: '',
    color: '',
    quantity: 1,
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === form.product),
    [products, form.product],
  );

  const availableSizes = useMemo(
    () => [...new Set(selectedProduct?.variants.map((v) => v.size) ?? [])].sort((a, b) => a - b),
    [selectedProduct],
  );

  const availableColors = useMemo(
    () => [...new Set(selectedProduct?.variants.map((v) => v.color) ?? [])],
    [selectedProduct],
  );

  const selectedVariant = useMemo(() => {
    if (!selectedProduct || form.size === '' || !form.color) return undefined;
    return selectedProduct.variants.find(
      (v) => v.size === Number(form.size) && v.color.toLowerCase() === form.color.toLowerCase(),
    );
  }, [selectedProduct, form.size, form.color]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: name === 'quantity' ? Number(value) : value };
      if (name === 'product') {
        next.size = '';
        next.color = '';
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setSuccess(null);

    if (!form.product) {
      setFormError('Selecciona un producto');
      setIsSubmitting(false);
      return;
    }
    if (form.size === '') {
      setFormError('Selecciona una talla');
      setIsSubmitting(false);
      return;
    }
    if (!form.color) {
      setFormError('Selecciona un color');
      setIsSubmitting(false);
      return;
    }
    if (form.type === 'exit' && !selectedVariant) {
      setFormError('La combinación de talla y color no existe para este producto');
      setIsSubmitting(false);
      return;
    }
    if (form.quantity <= 0) {
      setFormError('La cantidad debe ser mayor a cero');
      setIsSubmitting(false);
      return;
    }
    if (form.type === 'exit' && selectedVariant && selectedVariant.stock < form.quantity) {
      setFormError(
        `Stock insuficiente. Solo hay ${selectedVariant.stock} unidades disponibles en talla ${form.size} color ${form.color}`,
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await createMovement({
        product: form.product,
        type: form.type,
        size: Number(form.size),
        color: form.color,
        quantity: form.quantity,
        reason: form.reason || undefined,
      });
      setSuccess('Movimiento registrado exitosamente');
      setForm({ product: '', type: 'entry', size: '', color: '', quantity: 1, reason: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading message="Cargando movimientos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight text-text">Movimientos de inventario</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-3xl space-y-5 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border"
      >
        <Select
          label="Producto"
          name="product"
          value={form.product}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un producto</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </Select>

        <Select label="Tipo" name="type" value={form.type} onChange={handleChange} required>
          <option value="entry">Entrada</option>
          <option value="exit">Salida</option>
          <option value="adjustment">Ajuste</option>
        </Select>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Talla"
            name="size"
            type="number"
            list="size-suggestions"
            value={form.size}
            onChange={handleChange}
            required
            disabled={!selectedProduct}
            placeholder={selectedProduct ? 'Ej: 42' : 'Selecciona un producto primero'}
          />
          <datalist id="size-suggestions">
            {availableSizes.map((size) => (
              <option key={size} value={size} />
            ))}
          </datalist>

          <Input
            label="Color"
            name="color"
            type="text"
            list="color-suggestions"
            value={form.color}
            onChange={handleChange}
            required
            disabled={!selectedProduct}
            placeholder={selectedProduct ? 'Ej: negro' : 'Selecciona un producto primero'}
          />
          <datalist id="color-suggestions">
            {availableColors.map((color) => (
              <option key={color} value={color} />
            ))}
          </datalist>
        </div>

        {form.size !== '' && form.color && selectedProduct && (
          <div className="flex animate-fade-in items-center gap-3 rounded-2xl bg-muted p-4 text-sm font-semibold text-text-secondary">
            <span
              className="h-5 w-5 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: getColorHex(form.color) }}
            />
            {selectedVariant ? (
              <>
                Stock actual: <span className="font-black text-text">{selectedVariant.stock}</span> unidades
              </>
            ) : (
              <>
                <span className="font-black text-text">Nueva variante</span> (se creará al registrar)
              </>
            )}
          </div>
        )}

        <Input
          label={form.type === 'adjustment' ? 'Nuevo stock' : 'Cantidad'}
          name="quantity"
          type="number"
          min={1}
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <Input
          label="Motivo"
          name="reason"
          type="text"
          value={form.reason}
          onChange={handleChange}
        />

        {formError && (
          <div className="flex animate-fade-in items-center gap-2 rounded-2xl bg-danger/5 p-4 text-sm font-bold text-danger">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {formError}
          </div>
        )}
        {success && (
          <div className="flex animate-fade-in items-center gap-2 rounded-2xl bg-success/10 p-4 text-sm font-bold text-success">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {success}
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
          <Package className="h-4 w-4" />
          Registrar movimiento
        </Button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-black text-text">Historial</h2>
        {movements.length === 0 ? (
          <div className="mt-4 rounded-3xl bg-surface py-16 text-center text-text-secondary ring-1 ring-border">
            <p className="text-lg font-bold text-text">No hay movimientos registrados</p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted text-text-secondary">
                  <tr>
                    <th className="px-6 py-4 font-bold">Fecha</th>
                    <th className="px-6 py-4 font-bold">Producto</th>
                    <th className="px-6 py-4 font-bold">Tipo</th>
                    <th className="px-6 py-4 font-bold">Talla</th>
                    <th className="px-6 py-4 font-bold">Color</th>
                    <th className="px-6 py-4 font-bold">Cantidad</th>
                    <th className="px-6 py-4 font-bold">Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {movements.map((movement) => {
                    const productName =
                      typeof movement.product === 'string' ? movement.product : movement.product.name;
                    return (
                      <tr key={movement._id} className="transition hover:bg-muted/50">
                        <td className="px-6 py-4 text-text-secondary">
                          {formatDate(movement.createdAt || '')}
                        </td>
                        <td className="px-6 py-4 font-bold text-text">{productName}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              typeStyles[movement.type]
                            }`}
                          >
                            {typeLabels[movement.type]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-text-secondary">{movement.size}</td>
                        <td className="px-6 py-4 text-text-secondary">{movement.color}</td>
                        <td className="px-6 py-4 font-bold text-text">{movement.quantity}</td>
                        <td className="px-6 py-4 text-text-secondary">{movement.reason || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
