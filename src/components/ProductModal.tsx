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
  const [imgHovered, setImgHovered] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(26, 28, 30, 0.55)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.90, y: 24 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Product details: ${product.name}`}
            style={{
              backgroundColor: tokens.colors.surfaceContainerLowest,
              borderRadius: '1.25rem',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '86vh',
              overflowY: 'auto',
              boxShadow: '0 40px 90px rgba(26, 28, 30, 0.24)',
            }}
          >
            {/* Hero Image with zoom on hover */}
            <div
              style={{ position: 'relative', overflow: 'hidden', borderRadius: '1.25rem 1.25rem 0 0' }}
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
            >
              <motion.img
                src={product.imageUrl}
                alt={product.name}
                animate={{ scale: imgHovered ? 1.07 : 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
              />
              <button
                onClick={onClose}
                aria-label="Close product detail"
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'rgba(255,255,255,0.92)',
                  border: 'none', borderRadius: '50%',
                  width: '2.25rem', height: '2.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: tokens.colors.onSurface,
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ ...tokens.typography.labelSm, color: tokens.colors.primary }}>
                  {product.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i} size={14}
                      fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                      color={i < Math.floor(product.rating) ? '#f59e0b' : tokens.colors.outlineVariant}
                    />
                  ))}
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.outline, marginLeft: '0.25rem' }}>
                    {product.rating}
                  </span>
                </div>
              </div>

              <h2 style={{ ...tokens.typography.headlineMd, color: tokens.colors.onSurface, margin: '0 0 0.625rem', fontSize: '1.5rem' }}>
                {product.name}
              </h2>

              <p style={{ ...tokens.typography.bodyLg, color: tokens.colors.onSurfaceVariant, margin: '0 0 1.5rem', lineHeight: 1.65 }}>
                {product.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: tokens.colors.onSurface, letterSpacing: '-0.02em' }}>
                  ₹{product.price.toLocaleString()}
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={handleAddToCart}
                  style={{
                    background: added
                      ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                      : `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryContainer})`,
                    color: '#fff', border: 'none',
                    padding: '0.875rem 2rem',
                    borderRadius: tokens.roundness.full,
                    fontSize: '0.9375rem', fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    minWidth: '180px', justifyContent: 'center',
                    transition: 'background 0.3s ease',
                  }}
                  aria-label={added ? 'Added to cart' : `Add ${product.name} to cart`}
                >
                  {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
