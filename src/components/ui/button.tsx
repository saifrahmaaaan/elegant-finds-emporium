import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg hover:-translate-y-0.5",
        destructive:
          "bg-destructive/90 text-destructive-foreground hover:bg-destructive hover:shadow-lg hover:-translate-y-0.5",
        outline:
          "border border-foreground/20 bg-transparent text-foreground hover:bg-foreground/5 hover:border-foreground/40 hover:shadow-sm",
        secondary:
          "bg-gold-500 text-foreground hover:bg-gold-600 hover:shadow-lg hover:-translate-y-0.5",
        ghost: "hover:bg-foreground/5 text-foreground hover:shadow-sm",
        link: "text-foreground underline-offset-4 hover:underline p-0 h-auto",
        gold: "bg-gradient-to-r from-gold-500 to-gold-600 text-foreground hover:from-gold-600 hover:to-gold-700 hover:shadow-lg hover:-translate-y-0.5"
      },
      size: {
        default: "h-12 px-6 py-3 text-base rounded-none",
        sm: "h-10 px-5 py-2.5 text-sm rounded-none",
        lg: "h-14 px-8 py-4 text-lg rounded-none",
        xl: "h-16 px-10 py-4 text-lg rounded-none",
        icon: "h-12 w-12 rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// Animation for button press effect
document.addEventListener('mousedown', (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('button, [role="button"], [data-button]')) {
    target.closest('button, [role="button"], [data-button]')?.classList.add('active:scale-95');
  }
});

document.addEventListener('mouseup', (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('button, [role="button"], [data-button]')) {
    target.closest('button, [role="button"], [data-button]')?.classList.remove('active:scale-95');
  }
});

export { Button, buttonVariants }
