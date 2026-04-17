import products from '../data/mock-products.json';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
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
  const { category, maxPrice, minPrice, searchTerm } = filters;

  return (products as Product[]).filter((product) => {
    let matches = true;

    if (category && product.category.toLowerCase() !== category.toLowerCase()) {
      matches = false;
    }

    if (maxPrice !== undefined && product.price > maxPrice) {
      matches = false;
    }

    if (minPrice !== undefined && product.price < minPrice) {
      matches = false;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (
        !product.name.toLowerCase().includes(term) &&
        !product.description.toLowerCase().includes(term)
      ) {
        matches = false;
      }
    }

    return matches;
  });
};
