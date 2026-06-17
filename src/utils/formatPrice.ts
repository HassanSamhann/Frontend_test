/** Format a number as USD price string e.g. $27.98 */
export function formatPrice(value: number): string {
  if (value === 0) return 'FREE';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}
