import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { tokens } from '../design-system';
import PaymentFlow from './PaymentFlow';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);

  const handleCheckout = () => setShowPayment(true);
  const handlePaymentClose = () => {
    setShowPayment(false);
    clearCart();
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(26, 28, 30, 0.4)',
                backdropFilter: 'blur(2px)',
                zIndex: 90,
              }}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              aria-label="Shopping cart"
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(100vw, 420px)',
                backgroundColor: tokens.colors.surfaceContainerLowest,
                boxShadow: '-8px 0 40px rgba(26, 28, 30, 0.12)',
                zIndex: 91,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: `1px solid ${tokens.colors.outlineVariant}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <ShoppingBag size={20} color={tokens.colors.primary} />
                  <h2 style={{ ...tokens.typography.titleMd, margin: 0, color: tokens.colors.onSurface }}>
                    Your Cart
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close cart"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: tokens.colors.onSurfaceVariant,
                    display: 'flex', alignItems: 'center', padding: '0.25rem',
                    borderRadius: tokens.roundness.sm
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
                {cartItems.length === 0 ? (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', height: '100%', gap: '1rem',
                    color: tokens.colors.onSurfaceVariant
                  }}>
                    <ShoppingBag size={48} strokeWidth={1} color={tokens.colors.outlineVariant} />
                    <p style={{ ...tokens.typography.bodyLg, margin: 0 }}>Your cart is empty</p>
                    <button
                      onClick={onClose}
                      style={{
                        background: `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryContainer})`,
                        color: '#fff', border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: tokens.roundness.lg,
                        cursor: 'pointer', fontWeight: 600
                      }}
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cartItems.map(({ product, quantity }) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{
                          display: 'flex', gap: '0.875rem',
                          backgroundColor: tokens.colors.surfaceContainerLow,
                          borderRadius: tokens.roundness.lg,
                          padding: '0.875rem',
                          alignItems: 'center'
                        }}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: tokens.roundness.md }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ ...tokens.typography.titleMd, margin: '0 0 0.25rem', fontSize: '0.9rem', color: tokens.colors.onSurface }}>
                            {product.name}
                          </p>
                          <p style={{ margin: 0, fontWeight: 700, color: tokens.colors.primary }}>
                            ₹{(product.price * quantity).toLocaleString()}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              aria-label="Decrease quantity"
                              style={{ background: tokens.colors.surfaceContainer, border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontWeight: 700, minWidth: '1.5rem', textAlign: 'center' }}>{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              aria-label="Increase quantity"
                              style={{ background: tokens.colors.surfaceContainer, border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`Remove ${product.name} from cart`}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.colors.error, padding: '0.25rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div style={{
                  padding: '1.25rem 1.5rem',
                  borderTop: `1px solid ${tokens.colors.outlineVariant}22`,
                  display: 'flex', flexDirection: 'column', gap: '0.875rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ ...tokens.typography.bodyLg, color: tokens.colors.onSurfaceVariant }}>Total</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: tokens.colors.onSurface }}>
                      ₹{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCheckout}
                    style={{
                      background: `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryContainer})`,
                      color: '#fff',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: tokens.roundness.lg,
                      fontSize: '1rem', fontWeight: 700,
                      cursor: 'pointer',
                      width: '100%',
                    }}
                    aria-label="Proceed to checkout"
                  >
                    Checkout — ₹{cartTotal.toLocaleString()}
                  </motion.button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {showPayment && (
        <PaymentFlow
          total={cartTotal}
          items={cartItems}
          onClose={handlePaymentClose}
        />
      )}
    </>
  );
};

export default CartDrawer;
