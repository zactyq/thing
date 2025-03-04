import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge Component
 * 
 * A small visual indicator component that can be used to display statuses,
 * counters, or labels. Badges are commonly used to highlight information or 
 * draw attention to specific elements in the UI.
 * 
 * Features:
 * - Multiple variants for different visual styles (default, outline, etc.)
 * - Customizable appearance through variant props
 * - Accessible through proper semantic HTML
 * - Consistent styling with the rest of the design system
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
        success:
          "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
        warning:
          "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 