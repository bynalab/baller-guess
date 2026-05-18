import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          {
            'bg-emerald-500 text-slate-50 hover:bg-emerald-600': variant === 'primary',
            'bg-slate-700 text-slate-50 hover:bg-slate-600': variant === 'secondary',
            'border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300': variant === 'outline',
            'bg-red-500 text-slate-50 hover:bg-red-600': variant === 'danger',
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-8 text-base': size === 'md',
            'h-14 px-10 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
