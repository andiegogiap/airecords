import React, { useState, useEffect, useRef } from 'react';

interface InputDialogProps {
  prompt: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

const InputDialog: React.FC<InputDialogProps> = ({ prompt, onConfirm, onCancel }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onCancel]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
        onConfirm(value.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="relative bg-[--card-bg-opaque] p-6 rounded-lg shadow-2xl w-full max-w-md animate-scale-in border border-[--card-border-color]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h2 id="dialog-title" className="text-lg font-bold text-glow-primary text-[--primary-color] mb-4">
            Input Required
          </h2>
          <label htmlFor="dialog-input" className="block text-sm font-medium text-gray-300 mb-2">
            {prompt}
          </label>
          <input
            ref={inputRef}
            type="text"
            id="dialog-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-[--primary-color] focus:border-[--primary-color] transition bg-black/30 border-gray-600 text-white"
          />
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-black bg-[--primary-color] rounded-md shadow-[0_0_8px_var(--primary-color)] hover:bg-[--primary-color-hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary-color]"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
       <style>{`
        @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InputDialog;