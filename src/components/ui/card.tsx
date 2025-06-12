import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hoverEffect?: 'scale' | 'elevate' | 'none'
  }
>(({ className, hoverEffect = 'elevate', ...props }, ref) => {
  const hoverClasses = {
    scale: 'hover:scale-[1.02]',
    elevate: 'hover:-translate-y-1',
    none: ''
  }[hoverEffect]

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border border-foreground/10 bg-background/80 backdrop-blur-sm transition-all duration-300",
        "shadow-sm hover:shadow-md hover:shadow-foreground/5",
        hoverClasses,
        "group/card",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    withBorder?: boolean
  }
>(({ className, withBorder = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6 pb-4",
      withBorder && "border-b border-foreground/5",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }
>(({ className, as: Tag = 'h3', ...props }, ref) => {
  const sizeClasses = {
    h2: 'text-3xl font-semibold tracking-tight',
    h3: 'text-2xl font-medium tracking-tight',
    h4: 'text-xl font-medium tracking-tight',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium'
  }[Tag]

  return (
    <Tag
      ref={ref}
      className={cn(
        "font-playfair text-foreground/90",
        "transition-colors duration-300 group-hover/card:text-foreground",
        sizeClasses,
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    size?: 'sm' | 'md' | 'lg'
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size]

  return (
    <p
      ref={ref}
      className={cn(
        "font-sans text-muted-foreground transition-colors duration-300",
        "group-hover/card:text-foreground/80",
        sizeClasses,
        className
      )}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    noPadding?: boolean
  }
>(({ className, noPadding = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      !noPadding && "p-6 pt-0",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center space-x-3 border-t border-foreground/5 p-6 pt-4",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
