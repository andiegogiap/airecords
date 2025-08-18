import React, { useEffect } from 'react';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!imageUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white dark:bg-gray-900 p-2 rounded-lg shadow-2xl max-w-4xl max-h-[90vh] transition-transform duration-300 scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 bg-white text-black rounded-full text-2xl font-bold flex items-center justify-center z-10 hover:bg-gray-200 transition-colors shadow-lg"
          aria-label="Close image view"
        >
          &times;
        </button>
        <img
          src={imageUrl}
          alt="Enlarged record view"
          className="max-w-full max-h-[calc(90vh-1rem)] object-contain rounded-md"
        />
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

export default ImageModal;
