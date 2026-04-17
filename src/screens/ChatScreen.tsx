import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../design-system';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import RecommendationFeed from '../components/RecommendationFeed';
import ProductModal from '../components/ProductModal';
import CartDrawer from '../components/CartDrawer';
import { getGeminiResponse, isDemoMode } from '../api/gemini';
import type { Product } from '../skills/searchCatalog';
import type { Content } from '@google/generative-ai';
import { Sparkles, ShoppingBag, Terminal } from 'lucide-react';
import productsData from '../data/mock-products.json';
import { useCart } from '../context/CartContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const CATEGORIES = ['Footwear', 'Electronics', 'Accessories'];

const ChatScreen: React.FC = () => {
  const { cartCount } = useCart();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: isDemoMode
        ? 'Welcome to Lumina Retail! 👋 Running in Demo Mode — no API key needed. Click a category chip or ask me anything like "Show me shoes under ₹3000"!'
        : 'Hello! I am your Lumina AI Assistant. I can help you find products, compare prices, or suggest the best electronics and footwear. Try a category below or just ask me anything!'
    }
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const featured = (productsData as Product[]).slice(0, 8);
    setProducts(featured);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const history: Content[] = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await getGeminiResponse(history, text);

      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      if (response.products.length > 0) {
        setProducts(response.products);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Sorry, I encountered an error.';
      setMessages(prev => [...prev, { role: 'model', text: msg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    handleSendMessage(`Show me ${category} products.`);
  };

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: tokens.colors.background,
        fontFamily: tokens.typography.fontFamily
      }}
    >
      {/* Header */}
      <header style={{
        padding: '0.875rem 1.5rem',
        backgroundColor: tokens.colors.surfaceContainerLowest,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: tokens.shadows.ambient,
        zIndex: 10,
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <h1 style={{ ...tokens.typography.titleMd, margin: 0, color: tokens.colors.primary, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} /> Lumina Retail
          </h1>
          {isDemoMode && (
            <div style={{
              backgroundColor: tokens.colors.surfaceContainerHighest,
              padding: '0.2rem 0.6rem',
              borderRadius: tokens.roundness.full,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: tokens.colors.onSurfaceVariant,
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Terminal size={11} /> Demo Mode
            </div>
          )}
        </div>

        {/* Cart icon with badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            position: 'relative', padding: '0.25rem', display: 'flex', alignItems: 'center',
            color: tokens.colors.onSurface,
          }}
          aria-label={`Open cart, ${cartCount} items`}
        >
          <ShoppingBag size={24} />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}
                aria-hidden="true"
              >
                {cartCount > 9 ? '9+' : cartCount}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Product Feed */}
        <section
          style={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            borderRight: `1px solid ${tokens.colors.outlineVariant}20`,
            overflow: 'hidden'
          }}
          aria-label="Product recommendations"
        >
          {/* Category chips */}
          <div style={{ padding: '1rem 1.5rem 0.75rem', flexShrink: 0, borderBottom: `1px solid ${tokens.colors.outlineVariant}18` }}>
            <h2 style={{ ...tokens.typography.headlineMd, margin: '0 0 0.875rem', fontSize: '1.375rem' }}>
              Curated for You
            </h2>
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="category-chip"
                  aria-pressed={activeCategory === cat}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: tokens.roundness.full,
                    border: 'none',
                    backgroundColor: activeCategory === cat ? tokens.colors.primary : tokens.colors.surfaceContainerHigh,
                    color: activeCategory === cat ? '#fff' : tokens.colors.onSurfaceVariant,
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <RecommendationFeed products={products} onViewDetails={setSelectedProduct} />
        </section>

        {/* Right: Chat */}
        <section
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: tokens.colors.surfaceContainerLowest,
            minWidth: '280px',
            maxWidth: '420px',
          }}
          aria-label="AI Assistant chat"
        >
          <div
            ref={scrollRef}
            style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} text={msg.text} />
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ padding: '0.5rem 1rem' }}
              >
                <div style={{
                  display: 'inline-flex',
                  gap: '4px',
                  padding: '0.625rem 0.875rem',
                  backgroundColor: tokens.colors.surfaceContainerLow,
                  borderRadius: '0.75rem',
                }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.8, delay, repeat: Infinity }}
                      style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: tokens.colors.primary }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </section>
      </div>

      {/* Product Detail Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
};

export default ChatScreen;
