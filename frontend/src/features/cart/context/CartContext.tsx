import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { CartItem } from '@/types';

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: number, color: string) => void;
  updateQuantity: (
    productId: string,
    size: number,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function makeKey(productId: string, size: number, color: string): string {
  return `${productId}-${size}-${color}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('shoes_store_cart');
    if (stored) {
      try {
        return JSON.parse(stored) as CartItem[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const persist = useCallback((nextItems: CartItem[]) => {
    setItems(nextItems);
    localStorage.setItem('shoes_store_cart', JSON.stringify(nextItems));
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      const key = makeKey(item.productId, item.size, item.color);
      const existingIndex = items.findIndex(
        (i) => makeKey(i.productId, i.size, i.color) === key,
      );

      if (existingIndex >= 0) {
        const next = [...items];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + item.quantity,
        };
        persist(next);
      } else {
        persist([...items, item]);
      }
    },
    [items, persist],
  );

  const removeItem = useCallback(
    (productId: string, size: number, color: string) => {
      const key = makeKey(productId, size, color);
      persist(items.filter((i) => makeKey(i.productId, i.size, i.color) !== key));
    },
    [items, persist],
  );

  const updateQuantity = useCallback(
    (productId: string, size: number, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }
      const key = makeKey(productId, size, color);
      persist(
        items.map((i) =>
          makeKey(i.productId, i.size, i.color) === key ? { ...i, quantity } : i,
        ),
      );
    },
    [items, persist, removeItem],
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}
