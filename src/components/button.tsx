"use client";

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden transform active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(var(--primary)/0.7)]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        glass: 'glassmorphic border-marvel-blue text-marvel-blue hover:shadow-[0_0_15px_hsl(var(--color-marvel-blue))] hover:border-marvel-blue/80 hover:text-white',
        glassRed: 'glassmorphic border-marvel-red text-marvel-red hover:shadow-[0_0_15px_hsl(var(--color-marvel-red))] hover:border-marvel-red/80 hover:text-white'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const [coords, setCoords] = React.useState({ x: -1, y: -1 });

    const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setCoords({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    const rippleEffect = variant === 'glass' || variant === 'glassRed' || variant === 'default' ? (
       <span
        className="pointer-events-none absolute -inset-px rounded-md opacity-0 transition-opacity"
        style={{
          background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, hsl(var(--primary) / 0.2), transparent 40%)`,
        }}
      />
    ) : null;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {props.children}
        {rippleEffect}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
