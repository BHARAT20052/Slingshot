import React from 'react';
import type { Product } from '../skills/searchCatalog';
import { tokens } from '../design-system';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div 
      style={{
        backgroundColor: tokens.colors.surfaceContainerLowest,
        borderRadius: tokens.roundness.lg,
        padding: '1rem',
        boxShadow: tokens.shadows.ambient,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        border: `1px solid ${tokens.colors.outlineVariant}15`,
        transition: 'transform 0.2s ease-in-out',
      }}
      className="product-card"
    >
      <img 
        src={product.imageUrl} 
        alt={product.name}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: tokens.roundness.md,
        }}
      />
      <div>
        <span style={{ 
          ...tokens.typography.labelSm, 
          color: tokens.colors.primary,
          marginBottom: '0.25rem',
          display: 'block'
        }}>
          {product.category}
        </span>
        <h3 style={{ 
          ...tokens.typography.titleMd, 
          color: tokens.colors.onSurface,
          margin: 0
        }}>
          {product.name}
        </h3>
        <p style={{ 
          ...tokens.typography.bodyLg, 
          color: tokens.colors.onSurfaceVariant,
          fontSize: '0.9rem',
          margin: '0.5rem 0'
        }}>
          {product.description}
        </p>
        <div style={{ 
          ...tokens.typography.headlineMd, 
          color: tokens.colors.onSurface,
          fontSize: '1.25rem'
        }}>
          ₹{product.price.toLocaleString()}
        </div>
      </div>
      <button 
        style={{
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.onPrimary,
          border: 'none',
          padding: '0.75rem',
          borderRadius: tokens.roundness.md,
          ...tokens.typography.labelSm,
          cursor: 'pointer',
          width: '100%',
          marginTop: 'auto'
        }}
      >
        View Details
      </button>
    </div>
  );
};

export default ProductCard;
