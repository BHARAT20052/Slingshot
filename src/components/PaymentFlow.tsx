import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Check, Loader, MapPin, ArrowRight, ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { tokens } from '../design-system';
import type { CartItem } from '../context/CartContext';

interface PaymentFlowProps {
  total: number;
  items: CartItem[];
  onClose: () => void;
}

type Step = 'shipping' | 'payment' | 'processing' | 'success';

const shippingVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const PaymentFlow: React.FC<PaymentFlowProps> = ({ total, items, onClose }) => {
  const [step, setStep] = useState<Step>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', pin: '' });
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: tokens.roundness.lg,
    border: `1.5px solid ${tokens.colors.outlineVariant}44`,
    backgroundColor: tokens.colors.surfaceContainerLow,
    fontSize: '0.9375rem',
    color: tokens.colors.onSurface,
    outline: 'none',
    boxSizing: 'border-box'
  };

  const handleProcessPayment = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 2800);
  };

  const formatCardNumber = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(26, 28, 30, 0.65)',
        backdropFilter: 'blur(6px)',
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          backgroundColor: tokens.colors.surfaceContainerLowest,
          borderRadius: '1.25rem',
          width: 'min(95vw, 520px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 40px 100px rgba(26,28,30,0.25)',
        }}
      >
        {/* Brand Header */}
        <div style={{
          background: `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryContainer})`,
          padding: '1.25rem 1.5rem',
          borderRadius: '1.25rem 1.25rem 0 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Lumina Pay
            </p>
            <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1.25rem' }}>
              ₹{total.toLocaleString()}
            </p>
          </div>
          <CreditCard size={28} color="rgba(255,255,255,0.85)" />
        </div>

        {/* Step Tracker */}
        {step !== 'processing' && step !== 'success' && (
          <div style={{ display: 'flex', padding: '1rem 1.5rem 0', gap: '0.5rem', alignItems: 'center' }}>
            {(['shipping', 'payment'] as Step[]).map((s, i) => (
              <React.Fragment key={s}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: step === s || (step === 'payment' && i === 0) ? tokens.colors.primary : tokens.colors.surfaceContainerHigh,
                  color: step === s || (step === 'payment' && i === 0) ? '#fff' : tokens.colors.onSurfaceVariant,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                }}>
                  {step === 'payment' && i === 0 ? <Check size={14} /> : i + 1}
                </div>
                <span style={{ fontSize: '0.8rem', color: step === s ? tokens.colors.primary : tokens.colors.onSurfaceVariant, fontWeight: step === s ? 700 : 400 }}>
                  {s === 'shipping' ? 'Shipping' : 'Payment'}
                </span>
                {i === 0 && <div style={{ flex: 1, height: '2px', backgroundColor: step === 'payment' ? tokens.colors.primary : tokens.colors.surfaceContainerHigh, borderRadius: '2px' }} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Steps */}
        <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
          <AnimatePresence mode="wait">
            {/* Shipping Step */}
            {step === 'shipping' && (
              <motion.div key="shipping" variants={shippingVariants} initial="hidden" animate="visible" exit="exit">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <MapPin size={18} color={tokens.colors.primary} />
                  <h3 style={{ margin: 0, ...tokens.typography.titleMd, color: tokens.colors.onSurface }}>Shipping Details</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input style={inputStyle} placeholder="Full Name" value={shipping.name} onChange={e => setShipping(s => ({ ...s, name: e.target.value }))} aria-label="Full name" />
                  <input style={inputStyle} placeholder="Street Address" value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} aria-label="Street address" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input style={inputStyle} placeholder="City" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} aria-label="City" />
                    <input style={inputStyle} placeholder="PIN Code" value={shipping.pin} onChange={e => setShipping(s => ({ ...s, pin: e.target.value }))} aria-label="PIN code" maxLength={6} />
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('payment')}
                  disabled={!shipping.name || !shipping.address || !shipping.city || !shipping.pin}
                  style={{
                    marginTop: '1.25rem',
                    background: `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryContainer})`,
                    color: '#fff', border: 'none',
                    padding: '0.9rem', borderRadius: tokens.roundness.lg,
                    width: '100%', fontWeight: 700, fontSize: '0.9375rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    opacity: (!shipping.name || !shipping.address || !shipping.city || !shipping.pin) ? 0.6 : 1
                  }}
                  aria-label="Continue to payment"
                >
                  Continue to Payment <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <motion.div key="payment" variants={shippingVariants} initial="hidden" animate="visible" exit="exit">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button onClick={() => setStep('shipping')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: tokens.colors.onSurfaceVariant, padding: 0 }} aria-label="Back to shipping">
                    <ChevronLeft size={18} />
                  </button>
                  <CreditCard size={18} color={tokens.colors.primary} />
                  <h3 style={{ margin: 0, ...tokens.typography.titleMd, color: tokens.colors.onSurface }}>Payment Method</h3>
                </div>

                {/* Toggle Tabs */}
                <div style={{ display: 'flex', backgroundColor: tokens.colors.surfaceContainerHigh, borderRadius: tokens.roundness.lg, padding: '0.25rem', marginBottom: '1.25rem' }}>
                  {(['card', 'upi'] as const).map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      style={{
                        flex: 1, padding: '0.6rem', border: 'none', borderRadius: tokens.roundness.md,
                        backgroundColor: paymentMethod === method ? tokens.colors.surfaceContainerLowest : 'transparent',
                        fontWeight: paymentMethod === method ? 700 : 400,
                        color: paymentMethod === method ? tokens.colors.primary : tokens.colors.onSurfaceVariant,
                        cursor: 'pointer', fontSize: '0.875rem',
                        boxShadow: paymentMethod === method ? tokens.shadows.ambient : 'none',
                        transition: 'all 0.2s'
                      }}
                      aria-label={`Pay with ${method === 'card' ? 'Credit/Debit Card' : 'UPI'}`}
                    >
                      {method === 'card' ? '💳 Card' : '📱 UPI'}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input style={inputStyle} placeholder="Card Number" value={card.number} onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))} aria-label="Card number" maxLength={19} />
                    <input style={inputStyle} placeholder="Name on Card" value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} aria-label="Name on card" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <input style={inputStyle} placeholder="MM/YY" value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))} aria-label="Card expiry" maxLength={5} />
                      <input style={inputStyle} placeholder="CVV" type="password" value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} aria-label="CVV" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ ...tokens.typography.bodyLg, color: tokens.colors.onSurfaceVariant, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                      Enter your UPI ID to pay instantly
                    </p>
                    <input style={inputStyle} placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} aria-label="UPI ID" />
                  </div>
                )}

                {/* Order Summary */}
                <div style={{ marginTop: '1.25rem', padding: '0.875rem', backgroundColor: tokens.colors.surfaceContainerLow, borderRadius: tokens.roundness.lg }}>
                  <p style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '0.875rem', color: tokens.colors.onSurface }}>Order Summary</p>
                  {items.slice(0, 3).map(i => (
                    <div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: tokens.colors.onSurfaceVariant, marginBottom: '0.25rem' }}>
                      <span>{i.product.name} ×{i.quantity}</span>
                      <span>₹{(i.product.price * i.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  {items.length > 3 && <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: tokens.colors.outline }}>+{items.length - 3} more items</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${tokens.colors.outlineVariant}33`, fontWeight: 700, color: tokens.colors.onSurface }}>
                    <span>Total</span><span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleProcessPayment}
                  style={{
                    marginTop: '1.25rem',
                    background: `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryContainer})`,
                    color: '#fff', border: 'none',
                    padding: '0.9rem', borderRadius: tokens.roundness.lg,
                    width: '100%', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
                  }}
                  aria-label={`Pay ₹${total.toLocaleString()}`}
                >
                  Pay ₹{total.toLocaleString()}
                </motion.button>
              </motion.div>
            )}

            {/* Processing */}
            {step === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block', color: tokens.colors.primary, marginBottom: '1.5rem' }}
                >
                  <Loader size={48} />
                </motion.div>
                <h3 style={{ ...tokens.typography.headlineMd, color: tokens.colors.onSurface, fontSize: '1.25rem' }}>Processing Payment</h3>
                <p style={{ color: tokens.colors.onSurfaceVariant, marginTop: '0.5rem' }}>Please wait, we're securing your transaction...</p>
              </motion.div>
            )}

            {/* Success */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                  style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <Check size={36} color="#fff" />
                </motion.div>
                <h3 style={{ ...tokens.typography.headlineMd, color: tokens.colors.onSurface, fontSize: '1.375rem', marginBottom: '0.5rem' }}>
                  Order Confirmed! 🎉
                </h3>
                <p style={{ color: tokens.colors.onSurfaceVariant, marginBottom: '0.5rem' }}>
                  Your order of <strong>₹{total.toLocaleString()}</strong> has been placed successfully.
                </p>
                <p style={{ color: tokens.colors.onSurfaceVariant, fontSize: '0.875rem' }}>
                  Expected delivery: <strong>3–5 business days</strong>
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  style={{
                    marginTop: '1.5rem',
                    background: `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryContainer})`,
                    color: '#fff', border: 'none',
                    padding: '0.9rem 2.5rem', borderRadius: tokens.roundness.lg,
                    fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
                  }}
                  aria-label="Continue shopping"
                >
                  Continue Shopping
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentFlow;
