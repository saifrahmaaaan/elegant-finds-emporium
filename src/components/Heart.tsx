import * as React from "react";
import { cn } from '@/lib/utils';

export interface HeartProps extends React.SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const Heart = React.forwardRef<SVGSVGElement, HeartProps>(
  ({ className, filled = false, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      className={cn("w-6 h-6", className)}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 3.75c-1.74 0-3.41.81-4.5 2.09A6.18 6.18 0 0 0 7.5 3.75C4.42 3.75 2 6.13 2 9.08c0 2.91 2.54 5.33 6.45 8.74l1.05.93c.7.62 1.81.62 2.51 0l1.05-.93C19.46 14.41 22 11.99 22 9.08c0-2.95-2.42-5.33-5.5-5.33z"
      />
    </svg>
  )
);
Heart.displayName = "Heart";
