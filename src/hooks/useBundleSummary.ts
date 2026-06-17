import { useMemo } from 'react';
import { useBundle } from '@/context/BundleContext';
import type { BundleSummary, ReviewLineData } from '@/types';

const SHIPPING_THRESHOLD = 0;

export function useBundleSummary(): BundleSummary {
  const { state, products } = useBundle();

  return useMemo(() => {
    const lines: ReviewLineData[] = [];

    for (const product of products) {
      const productQtys = state.quantities[product.id] ?? {};

      if (product.variants && product.variants.length > 0) {
        // Per-variant lines — each variant with qty > 0 becomes its own row
        for (const variant of product.variants) {
          const qty = productQtys[variant.id] ?? 0;
          if (qty > 0) {
            lines.push({
              productId: product.id,
              variantId: variant.id,
              name: `${product.name} – ${variant.label}`,
              imageUrl: variant.imageUrl,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              priceLabel: product.priceLabel,
              quantity: qty,
              category: product.category,
            });
          }
        }
      } else {
        // Single-variant product
        const qty = productQtys['default'] ?? 0;
        if (qty > 0) {
          lines.push({
            productId: product.id,
            variantId: 'default',
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            priceLabel: product.priceLabel,
            quantity: qty,
            category: product.category,
          });
        }
      }
    }

    // Group by category
    const linesByCategory = {
      cameras:     lines.filter(l => l.category === 'cameras'),
      sensors:     lines.filter(l => l.category === 'sensors'),
      accessories: lines.filter(l => l.category === 'accessories'),
      plan:        lines.filter(l => l.category === 'plan'),
    };

    // Totals (plan items are monthly, not included in one-time subtotal for savings calc)
    const subtotal = lines.reduce((acc, l) => acc + l.price * l.quantity, 0);
    const compareAtSubtotal = lines.reduce(
      (acc, l) => acc + l.compareAtPrice * l.quantity,
      0
    );
    const savings = Math.max(0, compareAtSubtotal - subtotal);

    // Shipping is free above threshold
    const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : 5.99;
    const total = subtotal + shipping;

    // Per-step selected counts — number of distinct PRODUCTS (not variants) with any qty > 0
    const stepSelectedCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const product of products) {
      const productQtys = state.quantities[product.id] ?? {};
      const totalQty = Object.values(productQtys).reduce((a, b) => a + b, 0);
      if (totalQty > 0) {
        stepSelectedCounts[product.stepId] = (stepSelectedCounts[product.stepId] || 0) + 1;
      }
    }

    return {
      lines,
      linesByCategory,
      subtotal,
      compareAtSubtotal,
      savings,
      total,
      stepSelectedCounts,
    };
  }, [state, products]);
}
