import { useBundle } from '@/context/BundleContext';
import { useBundleSummary } from '@/hooks/useBundleSummary';
import { ReviewLineItem } from './ReviewLineItem';
import { formatPrice } from '@/utils/formatPrice';

const CATEGORY_LABELS: Record<string, string> = {
  cameras:     'CAMERAS',
  sensors:     'SENSORS',
  accessories: 'ACCESSORIES',
  plan:        'PLAN',
};

const CATEGORY_ORDER = ['cameras', 'sensors', 'accessories', 'plan'] as const;

export function ReviewPanel({ narrow = false }: { narrow?: boolean }) {
  const { saveToStorage } = useBundle();
  const summary = useBundleSummary();

  const hasItems = summary.lines.length > 0;

  function handleCheckout() {
    alert('🎉 Thank you! Your system is ready for checkout.\n\n(This is a prototype — no actual checkout in this demo.)');
  }

  function handleSave() {
    saveToStorage();
    alert('Your system configuration has been saved successfully!');
  }

  return (
    <aside
      className="rounded-[16px] overflow-hidden"
      style={{ backgroundColor: '#F0F4FF' }}
      aria-label="Your security system"
    >
      {/* ─── Body: at ≥1213px becomes 2 columns (unless narrow) ─── */}
      <div className={narrow ? '' : 'wide:flex wide:flex-row wide:items-stretch wide:gap-8'}>

        {/* ── LEFT: Header, Line Items + Shipping ──────────────────── */}
        <div className="flex-1 wide:min-w-0">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#D5E5FF]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5 wide:hidden">
              Review
            </p>
            <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
              Your security system
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Review your personalized protection system designed to keep what matters most safe.
            </p>
          </div>

          <div className="px-5 py-2">
          {!hasItems ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400">Your system is empty.</p>
              <p className="text-xs text-slate-300 mt-1">Add cameras and sensors to get started.</p>
            </div>
          ) : (
            <>
              {CATEGORY_ORDER.map((cat) => {
                const catLines = summary.linesByCategory[cat];
                if (!catLines || catLines.length === 0) return null;
                return (
                  <div key={cat} className="border-b border-[#D5E5FF]/60 pb-3 mb-2">
                    <p className="review-category">{CATEGORY_LABELS[cat]}</p>
                    <div className="space-y-1">
                      {catLines.map((line) => (
                        <ReviewLineItem
                          key={`${line.productId}-${line.variantId}`}
                          line={line}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* ─── Shipping Row ─────────────────────────── */}
              <div className="pt-2">
                <div className="flex items-center gap-2 py-2">
                  <div className="flex-shrink-0 w-9 h-9 rounded-md bg-white overflow-hidden flex items-center justify-center">
                    <img
                      src="/images/Wyze Sense Keypad.png"
                      alt="Fast Shipping"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-800 leading-snug">
                      Fast Shipping
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 flex-shrink-0 min-w-[58px] h-9">
                    <span className="review-product-name line-through" style={{ color: '#6F7882' }}>
                      $5.99
                    </span>
                    <span className="review-product-price" style={{ color: '#4E2FD2' }}>
                      FREE
                    </span>
                  </div>
                </div>
              </div>

              {/* ─── Totals (narrow/side layout — shown when NOT wide-split) ─ */}
              <div className={narrow ? 'border-t border-[#D5E5FF] pt-3 mt-1' : 'wide:hidden border-t border-[#D5E5FF] pt-3 mt-1'}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-[90px] h-[90px]">
                    <img
                      src="/images/Satisfaction Badge-05 1.png"
                      alt="100% Satisfaction Guarantee"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col items-end gap-1">
                    <span 
                      className="inline-flex items-center justify-center text-white text-[9px] font-bold rounded-[3px] whitespace-nowrap" 
                      style={{ backgroundColor: '#4E2FD2', width: '113px', height: '18px', padding: '5px 8px' }}
                    >
                      as low as $19.19/mo
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      {summary.compareAtSubtotal > summary.subtotal && (
                        <span className="text-xs text-[#6F7882] line-through">
                          {formatPrice(summary.compareAtSubtotal)}
                        </span>
                      )}
                      <span className="text-2xl font-extrabold text-[#4E2FD2]">
                        {formatPrice(summary.total)}
                      </span>
                    </div>
                  </div>
                </div>
                {summary.savings > 0 && (
                  <div className="text-center text-[11px] font-semibold mt-3" style={{ color: '#00A288' }}>
                    Congrats! You're saving{' '}
                    <strong>{formatPrice(summary.savings)}</strong> on your security bundle!
                  </div>
                )}
              </div>
            </>
          )}
          </div>
        </div>

        {/* ── RIGHT: Badge + Policy + Totals + CTA (wide only, not narrow) ── */}
        {hasItems && !narrow && (
          <div className="hidden wide:flex flex-col px-5 py-4 w-[340px] flex-shrink-0 gap-4">

            {/* Satisfaction badge + 30-day policy */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16">
                <img
                  src="/images/Satisfaction Badge-05 1.png"
                  alt="100% Satisfaction Guarantee"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900 leading-snug">
                  30-day hassle-free returns
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  If you're not totally in love with the product, we will refund you 100%.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#D5E5FF]" />

            {/* as low as + total */}
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center justify-center text-white text-[9px] font-bold rounded-[3px] whitespace-nowrap"
                style={{ backgroundColor: '#4E2FD2', width: '113px', height: '18px', padding: '5px 8px' }}
              >
                as low as $19.19/mo
              </span>
              <div className="flex items-baseline gap-1.5">
                {summary.compareAtSubtotal > summary.subtotal && (
                  <span className="text-xs text-[#6F7882] line-through">
                    {formatPrice(summary.compareAtSubtotal)}
                  </span>
                )}
                <span className="text-2xl font-extrabold text-[#4E2FD2]">
                  {formatPrice(summary.total)}
                </span>
              </div>
            </div>

            {/* Savings callout */}
            {summary.savings > 0 && (
              <div className="text-center text-[11px] font-semibold" style={{ color: '#00A288' }}>
                Congrats! You're saving{' '}
                <strong>{formatPrice(summary.savings)}</strong> on your security bundle!
              </div>
            )}

            {/* CTA Buttons */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!hasItems}
              className="checkout-btn disabled:opacity-50 disabled:cursor-not-allowed"
              id="checkout-btn-wide"
            >
              Checkout
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={handleSave}
                className="text-xs text-slate-500 underline underline-offset-2 hover:text-brand-600 transition-colors"
                id="save-system-btn-wide"
              >
                Save my system for later
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── CTA Buttons (narrow/non-wide layout only) ─── */}
      <div className={narrow ? 'px-5 py-4 border-t border-[#D5E5FF] space-y-3' : 'wide:hidden px-5 py-4 border-t border-[#D5E5FF] space-y-3'}>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={!hasItems}
          className="checkout-btn disabled:opacity-50 disabled:cursor-not-allowed"
          id="checkout-btn"
        >
          Checkout
        </button>
        <div className="text-center">
          <button
            type="button"
            onClick={handleSave}
            className="text-xs text-slate-500 underline underline-offset-2 hover:text-brand-600 transition-colors"
            id="save-system-btn"
          >
            Save my system for later
          </button>
        </div>
      </div>
    </aside>
  );
}
