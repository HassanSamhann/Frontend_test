import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      className="
        fixed bottom-5 right-5 z-50
        flex items-center gap-3 px-5 py-4.5
        bg-white border-l-4 rounded-lg shadow-xl
        max-w-md animate-fade-in-slide-up
      "
      style={{
        borderLeftColor: '#4E2FD2',
        fontFamily: 'var(--font-gilroy), sans-serif',
      }}
    >
      {/* Icon (Success Circle / Checkmark) */}
      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-[#EDF4FF]">
        <svg
          width="12"
          height="9"
          viewBox="0 0 12 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 4L4.5 7.5L11 1"
            stroke="#4E2FD2"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Message */}
      <div className="flex-1 text-sm font-medium text-slate-800 leading-snug">
        {message}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors ml-2"
        aria-label="Close notification"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L9 9M9 1L1 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
