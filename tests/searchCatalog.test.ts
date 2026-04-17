import { describe, it, expect } from 'vitest';
import { search_catalog } from '../src/skills/searchCatalog';

// Cart logic utilities (pure functions extracted for testing)
export const calculateCartTotal = (items: Array<{ price: number; quantity: number }>): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const calculateCartCount = (items: Array<{ quantity: number }>): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);

// --- searchCatalog tests ---
describe('search_catalog', () => {
  it('returns all products when called with no filters', async () => {
    const results = await search_catalog({});
    expect(results.length).toBe(30);
  });

  it('filters by category (case-insensitive)', async () => {
    const results = await search_catalog({ category: 'footwear' });
    expect(results.every(p => p.category.toLowerCase() === 'footwear')).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('filters by maxPrice correctly', async () => {
    const results = await search_catalog({ maxPrice: 1000 });
    expect(results.every(p => p.price <= 1000)).toBe(true);
  });

  it('filters by minPrice correctly', async () => {
    const results = await search_catalog({ minPrice: 10000 });
    expect(results.every(p => p.price >= 10000)).toBe(true);
  });

  it('filters by searchTerm in name', async () => {
    const results = await search_catalog({ searchTerm: 'watch' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(p => p.name.toLowerCase().includes('watch'))).toBe(true);
  });

  it('returns empty array for impossible combination', async () => {
    const results = await search_catalog({ category: 'Footwear', maxPrice: 1 });
    expect(results).toHaveLength(0);
  });

  it('all products have the required fields', async () => {
    const results = await search_catalog({});
    results.forEach(p => {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('category');
      expect(p).toHaveProperty('price');
      expect(p).toHaveProperty('rating');
      expect(p).toHaveProperty('imageUrl');
      expect(p).toHaveProperty('description');
    });
  });
});

// --- Cart Logic tests ---
describe('calculateCartTotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it('calculates total for single item', () => {
    expect(calculateCartTotal([{ price: 3500, quantity: 1 }])).toBe(3500);
  });

  it('calculates total for multiple quantities', () => {
    expect(calculateCartTotal([{ price: 1200, quantity: 3 }])).toBe(3600);
  });

  it('calculates total for multiple items', () => {
    expect(calculateCartTotal([
      { price: 2800, quantity: 2 },
      { price: 1500, quantity: 1 }
    ])).toBe(7100);
  });
});

describe('calculateCartCount', () => {
  it('returns 0 for empty cart', () => {
    expect(calculateCartCount([])).toBe(0);
  });

  it('counts items correctly', () => {
    expect(calculateCartCount([{ quantity: 2 }, { quantity: 3 }])).toBe(5);
  });

  it('counts single item', () => {
    expect(calculateCartCount([{ quantity: 1 }])).toBe(1);
  });
});
