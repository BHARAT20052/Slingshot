import { AnimatePresence, motion } from 'framer-motion';
import { X, Star, ShoppingCart, Check } from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { tokens } from '../design-system';
import type { Product } from '../skills/searchCatalog';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(26, 28, 30, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              cursor: 'pointer'
            }}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Product details: ${product.name}`}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: tokens.colors.surfaceContainerLowest,
              borderRadius: '1rem',
              width: 'min(90vw, 680px)',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 101,
              boxShadow: '0 32px 80px rgba(26, 28, 30, 0.18)',
            }}
          >
            {/* Image */}
            <div style={{ position: 'relative' }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '1rem 1rem 0 0' }}
              />
              <button
                onClick={onClose}
                aria-label="Close product detail"
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none', borderRadius: '50%',
                  width: '2.25rem', height: '2.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: tokens.colors.onSurface,
                  backdropFilter: 'blur(4px)'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
              {/* Category & Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ ...tokens.typography.labelSm, color: tokens.colors.primary }}>
                  {product.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                      color={i < Math.floor(product.rating) ? '#f59e0b' : tokens.colors.outlineVariant}
                    />
                  ))}
                  <span style={{ ...tokens.typography.labelSm, color: tokens.colors.outline, marginLeft: '0.25rem', fontSize: '0.75rem' }}>
                    {product.rating}
                  </span>
                </div>
              </div>

              <h2 style={{ ...tokens.typography.headlineMd, color: tokens.colors.onSurface, margin: '0 0 0.5rem' }}>
                {product.name}
              </h2>

              <p style={{ ...tokens.typography.bodyLg, color: tokens.colors.onSurfaceVariant, margin: '0 0 1.25rem' }}>
                {product.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: tokens.colors.onSurface, letterSpacing: '-0.02em' }}>
                  ₹{product.price.toLocaleString()}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  style={{
                    background: added
                      ? `linear-gradient(135deg, #16a34a, #22c55e)`
                      : `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryContainer})`,
                    color: '#fff',
                    border: 'none',
                    padding: '0.875rem 2rem',
                    borderRadius: tokens.roundness.lg,
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.3s ease',
                    minWidth: '180px',
                    justifyContent: 'center'
                  }}
                  aria-label={added ? "Added to cart" : `Add ${product.name} to cart`}
                >
                  {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
