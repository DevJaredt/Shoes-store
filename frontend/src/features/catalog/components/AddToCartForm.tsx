import { useState } from 'react';
import { Button } from '@/components';
import { useCart } from '@/features/cart/context/CartContext';
import { getProductId, getProductImage, getColorHex } from '@/utils/helpers';
import { Check, Minus, Plus } from 'lucide-react';
import type { Product } from '@/types';

interface AddToCartFormProps {
  product: Product;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<number | ''>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const sizes = [...new Set(product.variants.map((v) => v.size))].sort((a, b) => a - b);
  const colors = [
    ...new Set(product.variants.filter((v) => v.size === selectedSize).map((v) => v.color)),
  ];

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );

  const handleSizeChange = (size: number) => {
    setSelectedSize(size);
    setSelectedColor('');
    setQuantity(1);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setQuantity(1);
  };

  const handleAdd = () => {
    if (!selectedVariant || selectedSize === '' || !selectedColor) return;

    addItem({
      productId: getProductId(product),
      productName: product.name,
      size: selectedSize,
      color: selectedColor,
      quantity,
      unitPrice: product.price,
      image: getProductImage(product),
    });

    setMessage('Agregado al carrito');
    setTimeout(() => setMessage(null), 2500);
  };

  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const increaseQuantity = () => {
    setQuantity((q) => Math.min(q + 1, selectedVariant?.stock || q));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-text-secondary">Talla</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeChange(size)}
              className={`flex h-11 min-w-[3rem] items-center justify-center rounded-xl border-2 px-3 text-sm font-bold transition-all ${
                selectedSize === size
                  ? 'border-accent bg-accent text-white shadow-md shadow-accent/25'
                  : 'border-border bg-surface text-text hover:border-text-secondary hover:bg-muted'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {selectedSize !== '' && (
        <div className="animate-fade-in">
          <p className="text-sm font-semibold text-text-secondary">Color</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`group flex items-center gap-2 rounded-full border-2 bg-surface px-3 py-1.5 text-sm font-semibold transition-all ${
                    isSelected
                      ? 'border-accent text-text shadow-sm'
                      : 'border-border text-text-secondary hover:border-text-secondary hover:text-text'
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: getColorHex(color) }}
                  />
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedVariant && (
        <div className="animate-fade-in rounded-2xl bg-success/5 p-4 text-sm font-semibold text-success">
          Stock disponible: {selectedVariant.stock} unidades
        </div>
      )}

      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-text-secondary">Cantidad</span>
        <div className="flex items-center rounded-2xl border border-border bg-surface shadow-sm">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-l-2xl text-text-secondary transition hover:bg-muted hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex h-10 w-12 items-center justify-center text-sm font-bold text-text">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increaseQuantity}
            disabled={!selectedVariant || quantity >= selectedVariant.stock}
            className="flex h-10 w-10 items-center justify-center rounded-r-2xl text-text-secondary transition hover:bg-muted hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Button
        variant="accent"
        size="lg"
        fullWidth
        onClick={handleAdd}
        disabled={!selectedVariant || quantity > (selectedVariant?.stock || 0)}
      >
        Agregar al carrito
      </Button>

      {message && (
        <div className="flex animate-fade-in-up items-center justify-center gap-2 rounded-2xl bg-success/10 py-3 text-sm font-bold text-success">
          <Check className="h-4 w-4" />
          {message}
        </div>
      )}
    </div>
  );
}
