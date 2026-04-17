import productsData from '../data/mock-products.json';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
  description: string;
}

export interface SearchFilters {
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  searchTerm?: string;
}

export const search_catalog = async (filters: SearchFilters): Promise<Product[]> => {
  let results = productsData as Product[];

  if (filters.category) {
    results = results.filter(p =>
      p.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter(p => p.price <= filters.maxPrice!);
  }

  if (filters.minPrice !== undefined) {
    results = results.filter(p => p.price >= filters.minPrice!);
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  return results;
};
