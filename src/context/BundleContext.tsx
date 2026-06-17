import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { BundleState, BundleAction, Product } from '@/types';

// ─── Initial State ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'bundle-builder-v2';

function buildInitialState(products: Product[]): BundleState {
  const quantities: BundleState['quantities'] = {};
  const activeVariants: BundleState['activeVariants'] = {};

  for (const product of products) {
    if (product.variants && product.variants.length > 0) {
      quantities[product.id] = {};
      for (const v of product.variants) {
        quantities[product.id][v.id] = 0;
      }
      activeVariants[product.id] = product.variants[0].id;
    } else {
      quantities[product.id] = { default: 0 };
    }
  }

  
  const preloaded: Record<string, Record<string, number>> = {
    'wyze-cam-v4':        { white: 1 },
    'wyze-cam-pan-v3':    { white: 2 },
    'wyze-sense-motion':  { default: 2 },
    'wyze-sense-hub':     { default: 1 },
    'wyze-microsd-256':   { default: 2 },
    'cam-unlimited':      { default: 1 },
  };

  for (const [id, qty] of Object.entries(preloaded)) {
    if (quantities[id]) {
      quantities[id] = qty;
    }
  }

  return { quantities, activeVariants, currentStep: 1 };
}

// ─── Reducer ───────────────────────────────────────────────────────────────
function bundleReducer(state: BundleState, action: BundleAction): BundleState {
  switch (action.type) {
    case 'SET_QUANTITY': {
      const newQty = Math.max(0, action.quantity);
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.productId]: {
            ...state.quantities[action.productId],
            [action.variantId]: newQty,
          },
        },
      };
    }
    case 'SET_ACTIVE_VARIANT':
      return {
        ...state,
        activeVariants: {
          ...state.activeVariants,
          [action.productId]: action.variantId,
        },
      };
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'LOAD_SAVED':
      return action.state;
    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────
interface BundleContextValue {
  state: BundleState;
  products: Product[];
  dispatch: React.Dispatch<BundleAction>;
  saveToStorage: () => void;
}

const BundleContext = createContext<BundleContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────
interface BundleProviderProps {
  products: Product[];
  children: React.ReactNode;
}

export function BundleProvider({ products, children }: BundleProviderProps) {
  const [state, dispatch] = useReducer(bundleReducer, undefined, () => {
    // Try to rehydrate from localStorage first
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as BundleState;
      }
    } catch {
      // Ignore parse errors
    }
    return buildInitialState(products);
  });

  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  // Auto-save on state change (debounced via native setTimeout)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Ignore
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <BundleContext.Provider value={{ state, products, dispatch, saveToStorage }}>
      {children}
    </BundleContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useBundle() {
  const ctx = useContext(BundleContext);
  if (!ctx) throw new Error('useBundle must be used inside <BundleProvider>');
  return ctx;
}
