import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className={cn(
          "relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
