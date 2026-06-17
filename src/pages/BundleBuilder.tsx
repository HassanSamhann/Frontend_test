import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BundleProvider, useBundle } from '@/context/BundleContext';
import { AccordionStep } from '@/components/accordion/AccordionStep';
import { ProductCard } from '@/components/product-card/ProductCard';
import { ReviewPanel } from '@/components/review-panel/ReviewPanel';
import { useBundleSummary } from '@/hooks/useBundleSummary';
import type { Product } from '@/types';

// ─── Layout Mode ─────────────────────────────────────────────────────────────
export type LayoutMode = 'stack' | 'side';

// ─── Loader Skeleton ──────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-[12px] border border-slate-200 p-4 animate-pulse">
      <div className="h-28 bg-slate-100 rounded-xl mb-4" />
      <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-full mb-1" />
      <div className="h-3 bg-slate-100 rounded w-5/6 mb-4" />
      <div className="h-8 bg-slate-100 rounded" />
    </div>
  );
}

// ─── Layout Toggle Button ─────────────────────────────────────────────────
function LayoutToggle({ mode, onToggle }: { mode: LayoutMode; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      id="layout-toggle-btn"
      title={mode === 'side' ? 'Switch to stacked view' : 'Switch to side-by-side view'}
      className="
        hidden xl:flex items-center gap-2 px-3 py-1.5
        rounded-lg border-2 text-xs font-bold
        transition-all duration-200 select-none
        hover:shadow-md active:scale-95
      "
      style={{
        borderColor: '#4E2FD2',
        color: '#4E2FD2',
        backgroundColor: 'rgba(78,47,210,0.05)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4E2FD2';
        (e.currentTarget as HTMLButtonElement).style.color = '#fff';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(78,47,210,0.05)';
        (e.currentTarget as HTMLButtonElement).style.color = '#4E2FD2';
      }}
    >
      {/* Icon: two vertical bars = side, two horizontal bars = stack */}
      {mode === 'side' ? (
        // Currently side → clicking goes to stack → show stack icon
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="2" width="14" height="4" rx="1" fill="currentColor"/>
          <rect x="1" y="9" width="14" height="4" rx="1" fill="currentColor"/>
        </svg>
      ) : (
        // Currently stack → clicking goes to side → show side icon
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="2" width="6" height="12" rx="1" fill="currentColor"/>
          <rect x="9" y="2" width="6" height="12" rx="1" fill="currentColor"/>
        </svg>
      )}
      {mode === 'side' ? 'Stacked' : 'Side by Side'}
    </button>
  );
}

// ─── Step Config ─────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    title: 'Choose your cameras',
    icon: <img src="/images/icons/livestream.png" alt="" className="w-[26px] h-[26px] object-contain" />,
    next: 'Choose your plan',
  },
  {
    id: 2,
    title: 'Choose your plan',
    icon: <img src="/images/icons/Vector.png" alt="" className="w-[26px] h-[26px] object-contain" />,
    next: 'Choose your sensors',
  },
  {
    id: 3,
    title: 'Choose your sensors',
    icon: <img src="/images/icons/Vector2.png" alt="" className="w-[26px] h-[26px] object-contain" />,
    next: 'Add extra protection',
  },
  {
    id: 4,
    title: 'Add extra protection',
    icon: <img src="/images/icons/Vector3.png" alt="" className="w-[26px] h-[26px] object-contain" />,
    next: undefined,
  },
];

// ─── Inner Builder (needs BundleContext) ──────────────────────────────────
function BuilderInner({ products }: { products: Product[] }) {
  const { state, dispatch } = useBundle();
  const summary = useBundleSummary();

  // ── Layout toggle state ──────────────────────────────────────────────────
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('side');

  // Auto-reset to 'stack' when viewport drops below xl (1440px)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1440px)');
    // Initial check on mount
    if (!mql.matches) {
      setLayoutMode('stack');
    }
    function handleChange(e: MediaQueryListEvent) {
      if (!e.matches) setLayoutMode('stack');
    }
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  function openStep(step: number) {
    if (state.currentStep === step) {
      dispatch({ type: 'SET_STEP', step: 0 });
    } else {
      dispatch({ type: 'SET_STEP', step });
    }
  }

  function toggleLayout() {
    setLayoutMode(prev => (prev === 'stack' ? 'side' : 'stack'));
  }

  // ── Derived layout classes ────────────────────────────────────────────────
  //
  // Breakpoints:
  //   Mobile (<768px)  → single column, cards in 1 col
  //   md (768–1023px)  → single column, cards in 2 col grid
  //   lg (1024–1212px) → stack: full-width builder (cards in grid), full-width review BELOW
  //   wide (1213–1439) → stack: full-width builder (cards in row), full-width review BELOW
  //   xl (≥1440px)     → toggle between:
  //                         'stack' = stacked view (toggle button visible)
  //                         'side'  = builder left (768px) + review sticky right (380px)

  const isSideMode = layoutMode === 'side';

  // Outer wrapper flex direction:
  //  - below xl (1440px): column (stacked layout)
  //  - xl (>=1440px): side-by-side if layoutMode is 'side', otherwise column
  const outerFlexClass = isSideMode
    ? 'flex flex-col xl:flex-row gap-6 items-start justify-center w-full'
    : 'flex flex-col gap-6 items-center justify-center w-full';

  // Builder column width:
  //  stack: full width up to 768px (or 1240px when wide)
  //  side:  fixed 768px per Figma
  const builderColClass = isSideMode
    ? 'w-[768px] flex-shrink-0 min-w-0'
    : 'w-full max-w-[768px] wide:max-w-[1240px] space-y-0 min-w-0';

  // Review panel column:
  //  stack: full width up to 768px (or 1240px when wide) to match builder
  //  side:  fixed 380px sticky panel on right
  const reviewColClass = isSideMode
    ? 'w-full xl:w-[380px] flex-shrink-0 xl:sticky xl:top-6'
    : 'w-full max-w-[768px] wide:max-w-[1240px] flex-shrink-0';

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8">

      {/* ── Top bar: Toggle only ─────────────────────────── */}
      <div className="mb-6 flex items-center justify-end">
        {/* Layout toggle button — only visible at xl (≥1440px) */}
        <LayoutToggle mode={layoutMode} onToggle={toggleLayout} />
      </div>

      {/* ── Main layout ──────────────────────────────────────── */}
      <div className={outerFlexClass}>

        {/* ─── Left: Builder Accordion ─────────────────────── */}
        <div className={builderColClass}>
          {/* Side mode: steps wrapper with Figma dimensions */}
          <div className={isSideMode
            ? 'flex flex-col pt-[15px] rounded-[10px] overflow-hidden'
            : ''
          }>
            {STEPS.map((step) => {
              const stepProducts = products.filter(p => p.stepId === step.id);
              const selectedCount = summary.stepSelectedCounts[step.id] ?? 0;

              return (
                <AccordionStep
                  key={step.id}
                  stepNumber={step.id}
                  totalSteps={4}
                  title={step.title}
                  icon={step.icon}
                  isOpen={state.currentStep === step.id}
                  selectedCount={selectedCount}
                  nextLabel={step.next ? `Next: ${step.next}` : undefined}
                  onOpen={() => openStep(step.id)}
                  onNext={step.next ? () => openStep(step.id + 1) : undefined}
                  layoutMode={layoutMode}
                >
                  {stepProducts.map((product) => (
                    <ProductCard key={product.id} product={product} layoutMode={layoutMode} />
                  ))}
                </AccordionStep>
              );
            })}
          </div>
        </div>

        {/* ─── Right: Review Panel ──────────────────────────── */}
        <div className={reviewColClass}>
          <ReviewPanel narrow={isSideMode} />
        </div>

      </div>
    </div>
  );
}

// ─── Main Page with TanStack Query ────────────────────────────────────────
export default function BundleBuilderPage() {
  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        // Try backend API first
        const res = await fetch('http://localhost:3001/api/products');
        if (res.ok) {
          const data = await res.json();
          console.log('[API] Successfully loaded products from backend server.');
          return data;
        }
      } catch (err) {
        console.warn('[API] Backend server is not running or returned error. Falling back to local static JSON data.', err);
      }

      // Fallback: local static JSON
      const r = await fetch('/data/products.json');
      if (!r.ok) throw new Error('Failed to load products from local backup');
      return r.json();
    },
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <div className="mb-6 text-center">
          <div className="h-10 bg-slate-200 rounded w-72 animate-pulse mx-auto" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-[16px] border border-slate-200 p-5">
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[340px]">
            <div className="bg-white rounded-[16px] border border-slate-200 h-[400px] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !products) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-slate-600 font-semibold">Failed to load products</p>
          <p className="text-sm text-slate-400 mt-1">Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <BundleProvider products={products}>
      <BuilderInner products={products} />
    </BundleProvider>
  );
}
