import { useState } from 'react';
import { useBundle } from '@/context/BundleContext';
import { useBundleSummary } from '@/hooks/useBundleSummary';
import { ReviewLineItem } from './ReviewLineItem';
import { formatPrice } from '@/utils/formatPrice';
import { Toast } from '@/components/toast/Toast';

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

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  const hasItems = summary.lines.length > 0;

  function handleCheckout() {
    setShowCheckoutSuccess(true);
  }

  function handleSave() {
    saveToStorage();
    setToastMessage('System configuration saved successfully to your browser!');
    setShowToast(true);
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

      {/* ─── Toast Notification ─── */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* ─── Checkout Success Modal ─── */}
      {showCheckoutSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up text-left"
            style={{ fontFamily: 'var(--font-gilroy), sans-serif' }}
          >
            {/* Modal Header */}
            <div className="bg-[#4E2FD2] text-white px-6 py-8 text-center relative flex-shrink-0">
              {/* Animated Success Checkmark */}
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 border border-white/30 animate-bounce">
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10L10 18L26 2" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">Order Confirmed!</h3>
              <p className="text-white/80 text-sm mt-1">Your premium security system bundle is ready to ship.</p>
              
              <button
                type="button"
                onClick={() => setShowCheckoutSuccess(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 1.5L16.5 16.5M16.5 1.5L1.5 16.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Modal Content / Order Summary */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Your Selected Bundle</h4>
                <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {CATEGORY_ORDER.map((cat) => {
                    const catLines = summary.linesByCategory[cat];
                    if (!catLines || catLines.length === 0) return null;
                    return (
                      <div key={cat} className="p-4 bg-slate-50/50">
                        <p className="text-[10px] font-bold text-[#4E2FD2] tracking-wider uppercase mb-2">{CATEGORY_LABELS[cat]}</p>
                        <div className="space-y-3">
                          {catLines.map((line) => (
                            <div key={`${line.productId}-${line.variantId}`} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                <img src={line.imageUrl} alt={line.name} className="w-8 h-8 object-contain bg-white rounded-md border border-slate-100 p-0.5" />
                                <div className="text-left">
                                  <p className="font-semibold text-slate-800">{line.name}</p>
                                  {line.variantId !== 'default' && (
                                    <p className="text-xs text-slate-500 capitalize">Color: {line.variantId}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-slate-700">Qty: {line.quantity}</p>
                                <p className="text-xs text-slate-500 font-semibold">{formatPrice(line.price * line.quantity)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Totals */}
              <div className="bg-[#F0F4FF] rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Regular Subtotal</span>
                  <span className="line-through">{formatPrice(summary.compareAtSubtotal)}</span>
                </div>
                {summary.savings > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-[#00A288]">
                    <span>Your Bundle Savings</span>
                    <span>-{formatPrice(summary.savings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className="text-[#4E2FD2] font-semibold">FREE</span>
                </div>
                <div className="border-t border-[#D5E5FF] pt-2 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-800">Final Total</span>
                  <span className="text-2xl font-extrabold text-[#4E2FD2]">{formatPrice(summary.total)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-slate-500 font-medium">As low as $19.19/mo financing available.</span>
              <button
                type="button"
                onClick={() => setShowCheckoutSuccess(false)}
                className="px-6 py-2.5 bg-[#4E2FD2] hover:bg-[#3D22B0] text-white text-sm font-bold rounded-lg transition-colors shadow-md active:scale-95"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
