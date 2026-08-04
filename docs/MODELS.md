# Shoes Store — Modelos de datos

## User

Usuarios del sistema. Pueden tener rol `admin` o `customer`.

```typescript
{
  name: string;              // requerido
  email: string;             // requerido, único, indexado
  password: string;          // requerido, hash con bcryptjs
  document: string;          // requerido, único, indexado
  phone: string;             // requerido, indexado
  role: 'admin' | 'customer';  // default: 'customer'
  active: boolean;           // default: true
  createdAt: Date;
  updatedAt: Date;
}
```

**Índices:** `email`, `document`, `{ role: 1, active: 1 }`

---

## Category

Categorías de productos.

```typescript
{
  name: string;        // requerido
  description: string; // requerido
  active: boolean;     // default: true
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Product

Productos con variantes por talla y color.

```typescript
{
  name: string;              // requerido
  brand: string;             // requerido
  category: ObjectId;        // ref Category, requerido, indexado
  description: string;       // requerido
  purchasePrice: number;     // requerido, min 0
  price: number;             // requerido, min 0
  active: boolean;           // default: true, indexado
  images: string[];          // opcional
  variants: [
    {
      size: number;          // requerido
      color: string;         // requerido
      stock: number;         // requerido, min 0
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}
```

**Índices:** `category`, `active`, `{ category: 1, active: 1 }`

---

## Sale

Registro de compras/ventas. El cliente es un `User` con rol `customer`.

```typescript
{
  customer: ObjectId;        // ref User, requerido, indexado
  createdBy: ObjectId;       // ref User, requerido, indexado
  date: Date;                // default: now, indexado
  items: [
    {
      product: ObjectId;     // ref Product
      nameSnapshot: string;  // nombre del producto al momento de la compra
      size: number;
      color: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }
  ];
  discount: number;          // default: 0, min 0
  total: number;             // requerido, min 0
  paymentMethod: 'cash' | 'card' | 'transfer';
  createdAt: Date;
  updatedAt: Date;
}
```

**Índices:** `{ date: -1, createdBy: 1 }`, `{ customer: 1, date: -1 }`

---

## InventoryMovement

Trazabilidad de todos los cambios de stock. Solo el admin crea movimientos directamente; las compras generan salidas automáticas.

```typescript
{
  product: ObjectId;         // ref Product, requerido, indexado
  type: 'entry' | 'exit' | 'adjustment';
  size: number;              // requerido
  color: string;             // requerido
  quantity: number;          // requerido, min 0
  reason?: string;           // motivo del movimiento
  user: ObjectId;            // ref User, requerido
  sale?: ObjectId;           // ref Sale, opcional
  createdAt: Date;
  updatedAt: Date;
}
```

**Índices:** `{ product: 1, size: 1, color: 1, createdAt: -1 }`, `{ type: 1, createdAt: -1 }`, `{ user: 1, createdAt: -1 }`

---

## Decisiones de diseño

- **Un solo modelo de usuario:** el cliente y el admin comparten el modelo `User`, diferenciados por el campo `role`. Esto simplifica el MVP para un solo administrador.
- **Snapshot en ventas:** el campo `nameSnapshot` preserva el nombre del producto al momento de la compra, evitando pérdida de información histórica si el producto cambia.
- **Movimientos de inventario como auditoría:** todo cambio de stock pasa por `InventoryMovement`, incluso las salidas generadas automáticamente por compras.
- **Índices estratégicos:** se agregan índices en campos de consulta frecuente para reportes y operaciones comunes.
