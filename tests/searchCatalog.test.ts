import { describe, it, expect } from 'vitest';
import { search_catalog } from '../src/skills/searchCatalog';

describe('search_catalog skill', () => {
  it('should filter products by category', async () => {
    const results = await search_catalog({ category: 'Footwear' });
    expect(results.every(p => p.category === 'Footwear')).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should filter products by max price', async () => {
    const maxPrice = 4000;
    const results = await search_catalog({ maxPrice });
    expect(results.every(p => p.price <= maxPrice)).toBe(true);
    expect(results.some(p => p.price <= 4000)).toBe(true);
  });

  it('should filter products by min price', async () => {
    const minPrice = 10000;
    const results = await search_catalog({ minPrice });
    expect(results.every(p => p.price >= minPrice)).toBe(true);
  });

  it('should filter products by search term', async () => {
    const searchTerm = 'CloudStrider';
    const results = await search_catalog({ searchTerm });
    expect(results.every(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )).toBe(true);
  });

  it('should handle combined filters (Footwear under ₹4000)', async () => {
    const results = await search_catalog({ category: 'Footwear', maxPrice: 4000 });
    expect(results.every(p => p.category === 'Footwear' && p.price <= 4000)).toBe(true);
    // CloudStrider Running Shoes (3500) and SwiftStep Loafers (3200) should match
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('should return empty list if no matches found', async () => {
    const results = await search_catalog({ category: 'Electronics', maxPrice: 100 });
    expect(results.length).toBe(0);
  });
});
