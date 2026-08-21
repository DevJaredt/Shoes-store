import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { productsApi } from '@/api';
import { Button, Input, Select, Loading, ErrorMessage } from '@/components';
import type { Product, ProductVariant } from '@/types';

interface FormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  purchasePrice: number;
  price: number;
  images: string;
}

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { createProduct, updateProduct } = useAdminProducts();
  const { categories, isLoading: categoriesLoading } = useAdminCategories();

  const [form, setForm] = useState<FormData>({
    name: '',
    brand: '',
    category: '',
    description: '',
    purchasePrice: 0,
    price: 0,
    images: '',
  });
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    productsApi
      .getById(id)
      .then((product: Product) => {
        setForm({
          name: product.name,
          brand: product.brand,
          category: typeof product.category === 'string' ? product.category : product.category._id,
          description: product.description,
          purchasePrice: product.purchasePrice,
          price: product.price,
          images: product.images.join('\n'),
        });
        setVariants(product.variants);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar el producto'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'purchasePrice' || name === 'price' ? Number(value) : value,
    }));
  };

  const addVariant = () => {
    setVariants([...variants, { size: 0, color: '', stock: 0 }]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const next = [...variants];
    next[index] = { ...next[index], [field]: value };
    setVariants(next);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      images: form.images.split('\n').map((url) => url.trim()).filter(Boolean),
      variants: variants.map((v) => ({
        size: Number(v.size),
        color: v.color,
        stock: Number(v.stock),
      })),
    };

    try {
      if (isEditing && id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || categoriesLoading) {
    return <Loading message="Cargando..." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight text-text">
        {isEditing ? 'Editar producto' : 'Nuevo producto'}
      </h1>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-3xl space-y-5 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border"
      >
        <Input label="Nombre" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Marca" name="brand" value={form.brand} onChange={handleChange} required />
        <Select
          label="Categoría"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Select>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-semibold text-text-secondary">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text shadow-sm transition-all placeholder:text-text-secondary/60 hover:border-border focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Precio de compra"
            name="purchasePrice"
            type="number"
            min={0}
            value={form.purchasePrice}
            onChange={handleChange}
            required
          />
          <Input
            label="Precio de venta"
            name="price"
            type="number"
            min={0}
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="images" className="text-sm font-semibold text-text-secondary">
            Imágenes (una URL por línea)
          </label>
          <textarea
            id="images"
            name="images"
            value={form.images}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text shadow-sm transition-all placeholder:text-text-secondary/60 hover:border-border focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
          />
        </div>

        <div className="rounded-3xl bg-muted p-5">
          <h2 className="text-lg font-black text-text">Variantes</h2>
          <div className="mt-4 space-y-4">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:grid-cols-4"
              >
                <Input
                  label="Talla"
                  type="number"
                  value={variant.size}
                  onChange={(e) => updateVariant(index, 'size', Number(e.target.value))}
                  required
                />
                <Input
                  label="Color"
                  type="text"
                  value={variant.color}
                  onChange={(e) => updateVariant(index, 'color', e.target.value)}
                  required
                />
                <Input
                  label="Stock"
                  type="number"
                  min={0}
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                  required
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="danger"
                    fullWidth
                    onClick={() => removeVariant(index)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" className="mt-4" onClick={addVariant}>
            Agregar variante
          </Button>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <Link
            to="/admin/products"
            className="inline-flex items-center justify-center rounded-full border-2 border-border bg-surface px-6 py-2.5 text-sm font-bold text-text-secondary transition hover:border-text-secondary hover:bg-muted hover:text-text"
          >
            Cancelar
          </Link>
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
}
