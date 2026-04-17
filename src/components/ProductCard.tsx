import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../skills/searchCatalog';
import { tokens } from '../design-system';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 24px 48px rgba(26,28,30,0.1)' }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      style={{
        backgroundColor: tokens.colors.surfaceContainerLowest,
        borderRadius: tokens.roundness.lg,
        padding: '1rem',
        boxShadow: tokens.shadows.ambient,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        cursor: 'pointer',
      }}
      onClick={() => onViewDetails(product)}
      role="button"
      aria-label={`View details for ${product.name}`}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onViewDetails(product)}
      className="product-card"
    >
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: tokens.roundness.md }}>
        <img
          src={imgError ? `https://picsum.photos/seed/${product.id}/600/400` : product.imageUrl}
          alt={product.name}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block',
          }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute', bottom: '0.5rem', right: '0.5rem',
          backgroundColor: 'rgba(255,255,255,0.92)',
          borderRadius: tokens.roundness.full,
          padding: '0.25rem 0.5rem',
          display: 'flex', alignItems: 'center', gap: '0.2rem',
          fontSize: '0.75rem', fontWeight: 700, color: '#b45309',
          backdropFilter: 'blur(4px)'
        }}>
          <Star size={11} fill="#f59e0b" color="#f59e0b" />
          {product.rating}
        </div>
      </div>

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
          margin: 0,
          fontSize: '1rem',
          lineHeight: 1.3
        }}>
          {product.name}
        </h3>
        <p style={{
          ...tokens.typography.bodyLg,
          color: tokens.colors.onSurfaceVariant,
          fontSize: '0.8125rem',
          margin: '0.375rem 0 0',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: tokens.colors.onSurface, letterSpacing: '-0.01em' }}>
          ₹{product.price.toLocaleString()}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={e => { e.stopPropagation(); onViewDetails(product); }}
          style={{
            background: `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryContainer})`,
            color: tokens.colors.onPrimary,
            border: 'none',
            padding: '0.55rem 1rem',
            borderRadius: tokens.roundness.full,
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          aria-label={`View details for ${product.name}`}
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
