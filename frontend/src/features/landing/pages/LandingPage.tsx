import { useState } from 'react';
import { useCatalog } from '@/features/catalog/hooks/useCatalog';
import { HeroSection } from '../components/HeroSection';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { StatsSection } from '../components/StatsSection';
import { PromoBanner } from '../components/PromoBanner';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';
import { BenefitsSection } from '../components/BenefitsSection';
import { NewsletterSection } from '../components/NewsletterSection';

export function LandingPage() {
  const { products, categories, isLoading, error, refetch } = useCatalog();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-surface">
      <HeroSection />
      <CategoryShowcase
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <FeaturedProducts
        products={products}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
      />
      <StatsSection />
      <PromoBanner />
      <TestimonialsCarousel />
      <BenefitsSection />
      <NewsletterSection />
    </div>
  );
}
