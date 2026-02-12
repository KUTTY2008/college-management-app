import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  as?: any;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', isLoading, children, as, ...props }, ref) => {
    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30',
      secondary: 'bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-500/30',
      outline: 'border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10',
      ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
    };

    const sizes = {
      default: 'px-6 py-3',
      sm: 'px-4 py-2 text-sm',
      lg: 'px-8 py-4 text-lg',
      icon: 'p-2 h-10 w-10',
    };

    const Component = as || motion.button;

    return (
      <Component
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : null}
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
