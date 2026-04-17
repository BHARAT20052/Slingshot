import React, { useState, useRef, useEffect } from 'react';
import { tokens } from '../design-system';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import RecommendationFeed from '../components/RecommendationFeed';
import { getGeminiResponse, isDemoMode } from '../api/gemini';
import type { Product } from '../skills/searchCatalog';
import type { Content } from '@google/generative-ai';
import { Menu, ShoppingBag, Sparkles, Terminal } from 'lucide-react';
import productsData from '../data/mock-products.json';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: isDemoMode 
        ? 'Welcome to the Demo! I am your Smart Retail Assistant. Since no API key is set, I am running in Offline Mode with full catalog access. How can I help you today?'
        : 'Hello! I am your Smart Retail Assistant. I can help you find products, compare prices, or suggest the best electronics and footwear. Try clicking a category below or just ask me anything!' 
    }
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load featured products on mount
  useEffect(() => {
    const featured = (productsData as Product[]).slice(0, 4);
    setProducts(featured);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = { role: 'user', text };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
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
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: error.message || 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    handleSendMessage(`Show me some ${category} products.`);
  };

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      backgroundColor: tokens.colors.background,
      fontFamily: tokens.typography.fontFamily
    }}>
      {/* Header */}
      <header style={{
        padding: '1rem 1.5rem',
        backgroundColor: tokens.colors.surfaceContainerLowest,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: tokens.shadows.ambient,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Menu size={24} style={{ cursor: 'pointer', color: tokens.colors.onSurface }} />
          <h1 style={{ ...tokens.typography.titleMd, margin: 0, color: tokens.colors.primary, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} /> Lumina Retail
          </h1>
          {isDemoMode && (
            <div style={{
              backgroundColor: tokens.colors.surfaceContainerHighest,
              padding: '0.2rem 0.6rem',
              borderRadius: tokens.roundness.sm,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: tokens.colors.onSurfaceVariant,
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Terminal size={12} /> Demo Mode
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <ShoppingBag size={24} style={{ cursor: 'pointer', color: tokens.colors.onSurface }} />
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Recommendations */}
        <section style={{ 
          flex: 2, 
          display: 'flex', 
          flexDirection: 'column',
          borderRight: `1px solid ${tokens.colors.outlineVariant}30`
        }}>
          <div style={{ padding: '1.5rem 1.5rem 1rem' }}>
            <h2 style={{ ...tokens.typography.headlineMd, margin: 0 }}>
              Curated for You
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {['Footwear', 'Electronics', 'Accessories'].map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: tokens.roundness.full,
                    border: `1px solid ${tokens.colors.primary}40`,
                    backgroundColor: tokens.colors.surfaceContainerLowest,
                    color: tokens.colors.primary,
                    ...tokens.typography.labelSm,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="category-chip"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <RecommendationFeed products={products} />
        </section>

        {/* Right Side: Chat Drawer */}
        <section style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: tokens.colors.surfaceContainerLowest
        }}>
          <div 
            ref={scrollRef}
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '1rem 0'
            }}
          >
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} text={msg.text} />
            ))}
            {isLoading && (
              <div style={{ padding: '0 1rem', color: tokens.colors.primary, ...tokens.typography.labelSm }}>
                Assistant is thinking...
              </div>
            )}
          </div>
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </section>
      </div>
    </main>
  );
};

export default ChatScreen;
