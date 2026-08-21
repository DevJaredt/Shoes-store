import { Select } from '@/components';
import { Search } from 'lucide-react';
import type { Category } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  search: string;
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (search: string) => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  search,
  onCategoryChange,
  onSearchChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-surface p-4 shadow-sm ring-1 ring-border sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary/70" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-border bg-muted py-3 pl-11 pr-4 text-sm font-medium text-text shadow-sm transition-all placeholder:text-text-secondary/60 hover:border-border focus:border-accent focus:bg-surface focus:outline-none focus:ring-4 focus:ring-accent/10"
        />
      </div>
      <Select
        className="sm:w-64"
        label="Categoría"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
