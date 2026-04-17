import React from 'react';
import type { Product } from '../skills/searchCatalog';
import ProductCard from './ProductCard';
import { tokens } from '../design-system';

interface RecommendationFeedProps {
  products: Product[];
}

const RecommendationFeed: React.FC<RecommendationFeedProps> = ({ products }) => {
  return (
    <div 
      style={{
        padding: '1.5rem',
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
          textAlign: 'center'
        }}>
          <p>No products to display.</p>
          <p style={{ fontSize: '0.9rem' }}>Try asking the assistant for suggestions!</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationFeed;
