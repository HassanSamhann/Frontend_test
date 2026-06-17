import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md';
  label?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  disabled = false,
  size = 'md',
  label,
}: QuantityStepperProps) {
  const btnSize = size === 'sm'
    ? 'w-6 h-6 rounded'
    : 'w-8 h-8 rounded-md';

  const iconSize = size === 'sm' ? 12 : 14;
  const valueWidth = size === 'sm' ? 'w-6 text-xs' : 'w-8 text-sm';

  return (
    <div className="flex items-center gap-1" role="group" aria-label={label ?? 'Quantity'}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className={`${btnSize} flex items-center justify-center border border-slate-200 bg-white text-slate-600
          hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
      >
        <Minus size={iconSize} />
      </button>

      <span
        className={`${valueWidth} text-center font-semibold text-slate-800`}
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className={`${btnSize} flex items-center justify-center border border-slate-200 bg-white text-slate-600
          hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
