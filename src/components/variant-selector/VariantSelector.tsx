import type { ProductVariant } from '@/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  activeVariantId: string;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  activeVariantId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div 
      className="flex flex-wrap w-full max-w-[205px] h-[26px] gap-[5px]" 
      role="radiogroup" 
      aria-label="Color options"
    >
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`Color: ${variant.label}`}
            onClick={() => onSelect(variant.id)}
            className={`variant-chip ${isActive ? 'active' : ''}`}
          >
            {/* Variant thumbnail image (small camera preview) */}
            {variant.imageUrl ? (
              <span
                className="w-4 h-4 rounded flex-shrink-0 overflow-hidden flex items-center justify-center bg-slate-100"
              >
                <img
                  src={variant.imageUrl}
                  alt={variant.label}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to color swatch on image error
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.style.backgroundColor = variant.colorHex;
                      parent.innerHTML = '';
                      parent.style.borderRadius = '50%';
                    }
                  }}
                />
              </span>
            ) : (
              /* Color swatch fallback */
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                style={{ backgroundColor: variant.colorHex }}
                aria-hidden="true"
              />
            )}
            <span className="text-[11px] leading-none">{variant.label}</span>
          </button>
        );
      })}
    </div>
  );
}
