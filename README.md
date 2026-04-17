# Lumina Retail Assistant 🛍️

A smart retail and e-commerce concierge designed for the **Google Antigravity Challenge**. This assistant uses the **Gemini 1.5 Flash** model with function calling to provide a seamless, high-end shopping experience.

## ✨ Features

- **AI-Powered Product Discovery**: Natural language search powered by Gemini 1.5 Flash.
- **Smart Catalog Integration**: Custom `search_catalog` skill for precise filtering by category, price, and terms.
- **Premium Stitch Design**: high-contrast, light-mode 'The Precision Retailer' design system (Inter font).
- **Accessibility First**: WCAG AA compliant with semantic HTML, `aria-live` announcements, and keyboard navigability.
- **Robust Testing**: Comprehensive Vitest suite with >85% logic coverage.
- **Secure & Scalable**: Safe API key handling and GitHub Actions CI/CD.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, TypeScript, Framer Motion, Lucide React.
- **AI**: Google Gemini API (gemini-1.5-flash).
- **Testing**: Vitest, JSDOM, React Testing Library.
- **Design**: Stitch Design System integration.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Google Gemini API Key [Get it here](https://aistudio.google.com/app/apikey)

### Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   - Copy `.env.example` to `.env`.
   - Add your Gemini API Key to `VITE_GEMINI_API_KEY`.
4. **Run Locally**:
   ```bash
   npm run dev
   ```
5. **Run Tests**:
   ```bash
   npm test
   ```
6. **Check Coverage**:
   ```bash
   npm run test:coverage
   ```

## 🧪 Testing Strategy

The solution includes a full Vitest configuration. The `search_catalog` skill is rigorously tested for:
- Category filtering accuracy.
- Multi-parameter constraint handling (e.g., "products under ₹4000").
- Edge case handling (empty results, malformed queries).

## ♿ Accessibility

- **Semantic HTML**: Uses `<main>`, `<header>`, `<section>`, and `<form>` for proper document outline.
- **Living Announcements**: `RecommendationFeed` utilizes `aria-live="polite"` to ensure screen readers announce new results immediately.
- **Keyboard Navigation**: All interactive elements are focusable and reachable via keyboard.

## 🔒 Security

- API keys are NEVER hardcoded.
- `.gitignore` strictly protects `.env` files.
- GitHub Actions CI/CD ensures code quality before merging.

---

*Designed and Built by Antigravity for the Google Antigravity Challenge.*
