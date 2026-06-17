// ─── Product Types ────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  label: string; // "White", "Grey", "Black"
  colorHex: string; // Swatch circle color
  imageUrl: string; // Variant-specific image
}

export interface Product {
  id: string;
  stepId: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  badge?: string; // e.g. "Save 22%"
  learnMoreUrl?: string;
  compareAtPrice: number; // Struck-through price
  price: number; // Active price
  priceLabel?: string; // e.g. "/mo" for subscriptions
  variants?: ProductVariant[]; // If undefined → no color selector
  imageUrl: string; // Default / no-variant image
  category: 'cameras' | 'sensors' | 'accessories' | 'plan';
}

// ─── Bundle State ─────────────────────────────────────────────────────────────

export interface BundleState {
  /**
   * quantities[productId][variantId] = count
   * For products without variants: quantities[productId]['default'] = count
   * This is THE critical shape — per-variant quantities, not per-product totals.
   */
  quantities: Record<string, Record<string, number>>;
  /**
   * activeVariants[productId] = currently-displayed variantId
   * Switching active variant does NOT reset other variant quantities.
   */
  activeVariants: Record<string, string>;
  /** Currently expanded accordion step (1–4) */
  currentStep: number;
}

// ─── Bundle Actions ───────────────────────────────────────────────────────────

export type BundleAction =
  | {
      type: 'SET_QUANTITY';
      productId: string;
      variantId: string;
      quantity: number;
    }
  | {
      type: 'SET_ACTIVE_VARIANT';
      productId: string;
      variantId: string;
    }
  | {
      type: 'SET_STEP';
      step: number;
    }
  | {
      type: 'LOAD_SAVED';
      state: BundleState;
    };

// ─── Review Panel Derived Types ───────────────────────────────────────────────

export interface ReviewLineData {
  productId: string;
  variantId: string; // 'default' for no-variant products
  name: string; // e.g. "Wyze Cam v4 – White"
  imageUrl: string;
  price: number;
  compareAtPrice: number;
  priceLabel?: string;
  quantity: number;
  category: Product['category'];
}

export interface BundleSummary {
  lines: ReviewLineData[];
  linesByCategory: Record<Product['category'], ReviewLineData[]>;
  subtotal: number;
  compareAtSubtotal: number;
  savings: number;
  total: number;
  /** Per-step count of distinct products with qty > 0 */
  stepSelectedCounts: Record<number, number>;
}
