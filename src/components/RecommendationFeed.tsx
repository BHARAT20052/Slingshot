import React from 'react';
import type { Product } from '../skills/searchCatalog';
import ProductCard from './ProductCard';
import { tokens } from '../design-system';
import { Sparkles } from 'lucide-react';

interface RecommendationFeedProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
}

const RecommendationFeed: React.FC<RecommendationFeedProps> = ({ products, onViewDetails }) => {
  return (
    <div
      style={{
        padding: '1.25rem 1.5rem 1.5rem',
        backgroundColor: tokens.colors.background,
        flex: 1,
        overflowY: 'auto',
      }}
      aria-live="polite"
      role="region"
      aria-label="Product recommendations"
    >
      {products.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: tokens.colors.onSurfaceVariant,
          ...tokens.typography.bodyLg,
          textAlign: 'center',
          gap: '0.75rem'
        }}>
          <Sparkles size={36} strokeWidth={1.2} color={tokens.colors.outlineVariant} />
          <p style={{ margin: 0 }}>No products to display.</p>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>Try clicking a category or asking the assistant!</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationFeed;
