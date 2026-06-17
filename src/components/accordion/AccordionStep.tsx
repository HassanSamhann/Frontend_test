import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';
import type { LayoutMode } from '@/pages/BundleBuilder';

interface AccordionStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  selectedCount: number;
  nextLabel?: string;
  onOpen: () => void;
  onNext?: () => void;
  children: ReactNode;
  layoutMode?: LayoutMode;
}

export function AccordionStep({
  stepNumber,
  totalSteps,
  title,
  icon,
  isOpen,
  selectedCount,
  nextLabel,
  onOpen,
  onNext,
  children,
  layoutMode = 'stack',
}: AccordionStepProps) {
  return (
    <div
      className={`
        transition-all duration-300 overflow-hidden
        ${layoutMode === 'side' ? '' : '-mt-px first:mt-0'}
        relative z-10
        ${isOpen
          ? 'bg-[#EDF4FF]  rounded-[10px] shadow-[0_0_0_1px_rgba(78,47,210,0.10),0_4px_16px_0_rgba(78,47,210,0.06)] z-20'
          : 'bg-white    rounded-none'
        }
      `}
      style={{ borderColor: '#1F1F1F' }}
      id={`step-${stepNumber}`}
    >
      {/* ─── Step Label Div ─── */}
      <div className="border-b border-[#1F1F1F]  px-5 py-2.5 text-left bg-transparent">
        <span className="step-label">Step {stepNumber} of {totalSteps}</span>
      </div>

      {/* ─── Header ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={isOpen}
        aria-controls={`step-content-${stepNumber}`}
        id={`step-btn-${stepNumber}`}
        className={`
          w-full flex items-center gap-3 px-5 py-4 text-left
          transition-colors duration-200
          ${isOpen ? 'bg-transparent' : 'bg-transparent border-b border-[#1F1F1F] hover:bg-slate-50/80'}
        `}
      >
        {/* Icon + title */}
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span
            className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-colors duration-200
              ${isOpen ? 'text-[#4E2FD2]' : 'text-slate-500'}`}
            aria-hidden="true"
          >
            {icon}
          </span>
          <h2
            className={`text-base font-bold leading-tight truncate transition-colors duration-200
              ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}
          >
            {title}
          </h2>
        </div>

        {/* Right side: selected count + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          {selectedCount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-xs font-bold whitespace-nowrap" style={{ color: '#4E2FD2' }}>
              {selectedCount} selected
            </span>
          )}
          <span className={`${isOpen ? '' : 'text-slate-400'}`} style={isOpen ? { color: '#4E2FD2' } : undefined}>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </div>
      </button>

      {/* ─── Collapsible Content ────────────────────────────── */}
      <div
        id={`step-content-${stepNumber}`}
        role="region"
        aria-labelledby={`step-btn-${stepNumber}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out
          ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className={`${layoutMode === 'side' ? 'px-[8px]' : 'px-[15px]'} pb-[20px] pt-[15px]`}>

          {/* Products Grid:
              mobile:      1-col grid
              sm/md:       2-col grid
              wide stack:  flex row wrap (cards horizontal)
              xl side:     2-col grid (compact, review panel takes right side)
          */}
          <div
            className={
              layoutMode === 'side'
                ? 'flex flex-wrap gap-[19px] justify-center isolate'
                : 'grid grid-cols-1 sm:grid-cols-2 gap-[15px] justify-items-center wide:flex wide:flex-row wide:flex-wrap wide:gap-[19px] wide:justify-start isolate'
            }
          >
            {children}
          </div>

          {/* Next Button */}
          {onNext && nextLabel && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={onNext}
                id={`step-next-btn-${stepNumber}`}
                className="px-10 py-2.5 rounded-xl border-2 font-bold text-sm transition-all duration-200"
                style={{ borderColor: '#4E2FD2', color: '#4E2FD2' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4E2FD2'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#4E2FD2'; }}
              >
                {nextLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
