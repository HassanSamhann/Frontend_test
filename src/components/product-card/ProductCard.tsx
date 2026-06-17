import { useBundle } from '@/context/BundleContext';
import { QuantityStepper } from '@/components/quantity-stepper/QuantityStepper';
import { VariantSelector } from '@/components/variant-selector/VariantSelector';
import { formatPrice } from '@/utils/formatPrice';
import type { Product } from '@/types';
import type { LayoutMode } from '@/pages/BundleBuilder';

interface ProductCardProps {
  product: Product;
  layoutMode?: LayoutMode;
}

export function ProductCard({ product, layoutMode = 'stack' }: ProductCardProps) {
  const { state, dispatch } = useBundle();

  const productQtys = state.quantities[product.id] ?? {};
  const activeVariantId = state.activeVariants[product.id] ?? 'default';

  const activeQty = product.variants
    ? (productQtys[activeVariantId] ?? 0)
    : (productQtys['default'] ?? 0);

  const totalQty = Object.values(productQtys).reduce((a, b) => a + b, 0);
  const isSelected = totalQty > 0;

  const activeVariant = product.variants?.find(v => v.id === activeVariantId);
  const displayImage = activeVariant?.imageUrl ?? product.imageUrl;

  const maxDescLen = 50;
  const isLong = product.description.length > maxDescLen;
  const displayDescription = isLong
    ? product.description.slice(0, maxDescLen) + '...'
    : product.description;

  function handleQtyChange(newQty: number) {
    const variantId = product.variants ? activeVariantId : 'default';
    dispatch({ type: 'SET_QUANTITY', productId: product.id, variantId, quantity: newQty });
  }

  function handleVariantSelect(variantId: string) {
    dispatch({ type: 'SET_ACTIVE_VARIANT', productId: product.id, variantId });
  }

  // ── Layout-aware classes ─────────────────────────────────────────────────
  // stack mode (wide ≥1213px): vertical card — Figma exact dimensions
  // side mode (xl ≥1440px):    horizontal card — same as tablet/mobile row layout
  const isWideVertical = layoutMode === 'stack';

  return (
    <article
      className={`product-card ${isSelected ? 'selected' : ''} relative overflow-hidden transition-all duration-200
        ${
          isWideVertical
            // stack/wide: horizontal on mobile→tablet, flip to vertical at wide breakpoint
            ? 'flex flex-row p-[11px] gap-[19px] h-[159px] w-full max-w-[361.5px] wide:flex-col wide:w-[224.6px] wide:h-[331.1px] wide:pt-[15px] wide:pb-[15px] wide:px-[11px] wide:gap-[19px] wide:max-w-none wide:flex-shrink-0'
            // side: always horizontal row layout regardless of breakpoint
            : 'flex flex-row p-[11px] gap-[19px] h-[159px] w-full max-w-[361.5px]'
        }
      `}
      aria-label={product.name}
    >
      
      <div
        className={`flex-shrink-0 flex flex-col items-center relative
          ${
            isWideVertical
              ? 'w-[101px] h-[137px] wide:w-[202.6px] wide:h-[117.39px]'
              : 'w-[101px] h-[137px]'
          }
        `}
      >

        {product.badge && (
          <span className="product-badge absolute top-0 left-0 z-10">
            {product.badge}
          </span>
        )}

        {/* Image container */}
        <div className="w-full h-full   rounded-[5px] flex items-center justify-center overflow-hidden">
          <img
            src={displayImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain p-0.5 transition-all duration-300"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.img-placeholder')) {
                const ph = document.createElement('div');
                ph.className = 'img-placeholder text-2xl flex items-center justify-center text-slate-300';
                ph.innerHTML = '📷';
                parent.appendChild(ph);
              }
            }}
          />
        </div>
      </div>

      <div
        className={`flex flex-col min-w-0
          ${
            isWideVertical
              // wide/stack vertical: flex-1 fills remaining card height naturally
              // overflow-hidden prevents content from escaping fixed card bounds
              ? 'flex-1 min-w-0 h-[137px] wide:w-[202.6px] wide:flex-1 wide:overflow-hidden wide:gap-[10px]'
              // side mode: flex-1 adapts to available space
              : 'flex-1 min-w-0 h-[137px]'
          }
        `}
      >

        <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-1">
          {product.name === 'Cam Unlimited' ? (
            <>
              <span className="text-black font-extrabold">Cam </span>
              <span style={{ color: '#4E2FD2' }} className="font-extrabold">Unlimited</span>
            </>
          ) : (
            product.name
          )}
        </h3>

        {/* Description + Learn More — Figma: Gilroy-Medium 12px */}
        <p className="text-[11px] text-slate-500 leading-[130%] tracking-[0.4px] h-[32px] overflow-hidden line-clamp-2">
          {displayDescription}
          {product.learnMoreUrl && (
            <a
              href={product.learnMoreUrl}
              className="font-normal ml-1 underline hover:text-[#3D22B0]"
              style={{ color: '#4E2FD2' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          )}
        </p>

        {/* Variant Selector */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-1.5 h-[26px]">
            <VariantSelector
              variants={product.variants}
              activeVariantId={activeVariantId}
              onSelect={handleVariantSelect}
            />
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 min-h-[4px]" />

        <div
          className={`flex items-center justify-between pt-1 border-t border-slate-100 h-[35px] gap-[10px]
            ${
              isWideVertical
                ? 'w-full wide:w-[202.6px]'
                : 'w-full'
            }
          `}
        >
          <QuantityStepper
            value={activeQty}
            onChange={handleQtyChange}
            label={`${product.name} quantity`}
          />

          {/* Prices — Figma: compare #D8392B line-through 16px, sale #575757 */}
          <div className="text-right flex flex-col items-end gap-0.5">
            {product.compareAtPrice > product.price && (
              <span className="price-compare">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className={`price-sale ${product.price === 0 ? '!text-emerald-600' : ''}`}>
              {product.price === 0 ? 'FREE' : formatPrice(product.price)}
              {product.priceLabel && (
                <span className="text-[10px] font-normal text-slate-400">{product.priceLabel}</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
