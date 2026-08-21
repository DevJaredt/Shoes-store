import { landingImages } from '../data/images';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryShowcaseProps {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

const fallbackCategories = [
  { key: 'running', name: 'Running', image: landingImages.categories.running },
  { key: 'casual', name: 'Casual', image: landingImages.categories.casual },
  { key: 'formal', name: 'Formal', image: landingImages.categories.formal },
  { key: 'sporty', name: 'Deportivo', image: landingImages.categories.sporty },
];

export function CategoryShowcase({ categories, activeCategory, onSelect }: CategoryShowcaseProps) {
  const displayedCategories =
    categories.length > 0
      ? categories.slice(0, 4).map((category, index) => ({
          id: category._id,
          name: category.name,
          image: fallbackCategories[index % fallbackCategories.length].image,
        }))
      : fallbackCategories.map((category) => ({ ...category, id: category.key }));

  return (
    <section className="border-t border-border bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Explora por estilo
          </span>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-text sm:text-4xl">
            Categorías destacadas
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayedCategories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  onSelect(activeCategory === category.id ? null : category.id);
                  const featuredSection = document.getElementById('featured');
                  if (featuredSection) {
                    featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl text-left ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    {category.name}
                  </h3>
                  <div
                    className={`mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-white transition-all ${
                      isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    Ver productos
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
