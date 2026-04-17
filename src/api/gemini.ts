import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { Tool, Content } from "@google/generative-ai";
import { search_catalog } from "../skills/searchCatalog";
import type { Product, SearchFilters } from "../skills/searchCatalog";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Check if we should use Demo Mode (missing or default key)
export const isDemoMode = !API_KEY || API_KEY === 'your_api_key_here' || API_KEY.trim() === '';

// Strict check for API key
const validateApiKey = () => {
  if (isDemoMode) {
    console.warn('RUNNING IN DEMO MODE: No API key found. AI results will be simulated.');
  }
};

const genAI = !isDemoMode ? new GoogleGenerativeAI(API_KEY) : null;

const searchCatalogTool: Tool = {
  functionDeclarations: [
    {
      name: "search_catalog",
      description: "Search for products in the retail catalog based on category, price range, and search terms.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          category: {
            type: SchemaType.STRING,
            description: "The category of the product (e.g., 'Footwear', 'Electronics', 'Accessories').",
          },
          maxPrice: {
            type: SchemaType.NUMBER,
            description: "The maximum price in INR (₹).",
          },
          minPrice: {
            type: SchemaType.NUMBER,
            description: "The minimum price in INR (₹).",
          },
          searchTerm: {
            type: SchemaType.STRING,
            description: "A specific search term or product name.",
          },
        },
      },
    },
  ],
};

export interface GeminiResponse {
  text: string;
  products: Product[];
  isDemo?: boolean;
}

// Simulated response logic for Demo Mode
const simulateGeminiResponse = async (userMessage: string): Promise<GeminiResponse> => {
  const msg = userMessage.toLowerCase();
  const filters: SearchFilters = {};

  if (msg.includes('shoe') || msg.includes('footwear') || msg.includes('sandals') || msg.includes('loafers')) {
    filters.category = 'Footwear';
  } else if (msg.includes('electronic') || msg.includes('earbuds') || msg.includes('watch') || msg.includes('keyboard') || msg.includes('mouse') || msg.includes('headphone') || msg.includes('camera')) {
    filters.category = 'Electronics';
  } else if (msg.includes('access') || msg.includes('wallet') || msg.includes('sleeve') || msg.includes('backpack') || msg.includes('gloves') || msg.includes('suitcase') || msg.includes('coat') || msg.includes('bag')) {
    filters.category = 'Accessories';
  }

  // Price detection (under / below / less than)
  const priceMatch = msg.match(/(?:under|below|less than|max)\s*(?:₹|inr)?\s*(\d+)/i);
  if (priceMatch) {
    filters.maxPrice = parseInt(priceMatch[1], 10);
  }

  const products = await search_catalog(filters);
  
  let responseText = `I've found ${products.length} products matching your request in Demo Mode.`;
  if (products.length === 0) {
    responseText = "I couldn't find any products in my demo database for that search, but here is our full catalog!";
    const all = await search_catalog({});
    return { text: responseText, products: all.slice(0, 4), isDemo: true };
  }

  return {
    text: responseText,
    products: products,
    isDemo: true
  };
};

export const getGeminiResponse = async (history: Content[], userMessage: string): Promise<GeminiResponse> => {
  validateApiKey();

  if (isDemoMode) {
    return simulateGeminiResponse(userMessage);
  }

  if (!genAI) {
    throw new Error('AI initialization failed.');
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: [searchCatalogTool],
  });

  const chat = model.startChat({
    history: history,
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  const calls = response.functionCalls();
  const firstCall = calls ? calls[0] : null;

  if (firstCall) {
    if (firstCall.name === "search_catalog") {
      const toolResult = await search_catalog(firstCall.args as SearchFilters);
      const result2 = await chat.sendMessage([
        {
          functionResponse: {
            name: "search_catalog",
            response: { products: toolResult },
          },
        },
      ]);
      return {
        text: result2.response.text(),
        products: toolResult,
        isDemo: false
      };
    }
  }

  return {
    text: response.text(),
    products: [],
    isDemo: false
  };
};
