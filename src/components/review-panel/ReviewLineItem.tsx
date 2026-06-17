import { useBundle } from '@/context/BundleContext';
import { QuantityStepper } from '@/components/quantity-stepper/QuantityStepper';
import { formatPrice } from '@/utils/formatPrice';
import type { ReviewLineData } from '@/types';

interface ReviewLineItemProps {
  line: ReviewLineData;
}

export function ReviewLineItem({ line }: ReviewLineItemProps) {
  const { dispatch, products } = useBundle();

  function handleQtyChange(newQty: number) {
    dispatch({
      type: 'SET_QUANTITY',
      productId: line.productId,
      variantId: line.variantId,
      quantity: newQty,
    });
  }

  const lineTotal = line.price * line.quantity;
  const compareLineTotal = line.compareAtPrice * line.quantity;
  const product = products.find(p => p.id === line.productId);

  return (
    <div className="flex items-center gap-2 py-2">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-9 h-9 rounded-md bg-slate-50 overflow-hidden flex items-center justify-center border border-slate-100">
        <img
          src={line.imageUrl}
          alt={line.name}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            const t = e.currentTarget;
            t.style.display = 'none';
            const parent = t.parentElement;
            if (parent) parent.innerHTML = '📷';
          }}
        />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="review-product-name text-slate-800 leading-snug line-clamp-2">
          {line.name === 'Cam Unlimited' ? (
            <>
              <span className="text-black font-extrabold">Cam </span>
              <span style={{ color: '#4E2FD2' }} className="font-extrabold">Unlimited</span>
            </>
          ) : (
            line.name
          )}
        </p>
      </div>

      {/* Stepper */}
      {product?.category !== 'plan' && (
        <div className="flex-shrink-0">
          <QuantityStepper
            value={line.quantity}
            onChange={handleQtyChange}
            size="sm"
            label={`${line.name} quantity`}
          />
        </div>
      )}

      {/* Price — stacked vertically: original (strikethrough) on top, sale below */}
      <div className="flex flex-col items-end justify-center flex-shrink-0 min-w-[58px]">
        {line.compareAtPrice > line.price && (
          <span 
            className="review-product-name line-through" 
            style={{ color: '#6F7882' }}
          >
            {formatPrice(compareLineTotal)}
            {product?.priceLabel}
          </span>
        )}
        <span
          className="review-product-price"
          style={{ color: lineTotal === 0 ? '#16a34a' : '#4E2FD2' }}
        >
          {lineTotal === 0 ? 'FREE' : formatPrice(lineTotal)}
          {product?.priceLabel}
        </span>
      </div>
    </div>
  );
}
