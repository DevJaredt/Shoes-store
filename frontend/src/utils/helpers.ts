export function getProductId(product: { _id?: string; id?: string }): string {
  return product._id || product.id || '';
}

export function getProductCategoryName(
  category: string | { name?: string },
): string {
  return typeof category === 'string' ? category : category?.name || 'Sin categoría';
}

export function getProductImage(product: { images?: string[] }): string {
  return product.images?.[0] || '/placeholder-shoe.svg';
}

const colorMap: Record<string, string> = {
  negro: '#111827',
  black: '#111827',
  blanco: '#f8fafc',
  white: '#f8fafc',
  rojo: '#ef4444',
  red: '#ef4444',
  azul: '#3b82f6',
  blue: '#3b82f6',
  verde: '#22c55e',
  green: '#22c55e',
  amarillo: '#eab308',
  yellow: '#eab308',
  naranja: '#f97316',
  orange: '#f97316',
  morado: '#a855f7',
  purple: '#a855f7',
  rosa: '#ec4899',
  pink: '#ec4899',
  gris: '#64748b',
  grey: '#64748b',
  gray: '#64748b',
  beige: '#d4c5a9',
  marrón: '#8b5a2b',
  brown: '#8b5a2b',
  celeste: '#38bdf8',
  cyan: '#06b6d4',
  plateado: '#cbd5e1',
  silver: '#cbd5e1',
  dorado: '#facc15',
  gold: '#facc15',
};

export function getColorHex(colorName: string): string {
  const normalized = colorName.toLowerCase().trim();
  return colorMap[normalized] || '#94a3b8';
}

export function getProductTotalStock(product: { variants?: { stock: number }[] }): number {
  return product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
}
