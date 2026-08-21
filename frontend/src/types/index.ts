export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  role: 'admin' | 'customer';
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  id?: string;
  name: string;
  description: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  _id?: string;
  size: number;
  color: string;
  stock: number;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  brand: string;
  category: string | Category;
  description: string;
  purchasePrice: number;
  price: number;
  active: boolean;
  images: string[];
  variants: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SaleItem {
  product: string;
  nameSnapshot?: string;
  size: number;
  color: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  _id: string;
  customer: string | User;
  createdBy: string | User;
  date: string;
  items: SaleItem[];
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryMovement {
  _id: string;
  product: string | Product;
  type: 'entry' | 'exit' | 'adjustment';
  size: number;
  color: string;
  quantity: number;
  reason?: string;
  user: string | User;
  sale?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  size: number;
  color: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}
