/**
 * BaseNode Component
 * 
 * A foundational React component that serves as the base building block for all node types
 * in the flow diagram system. It provides core styling and interaction behaviors that are
 * common across all node variants.
 *
 * Key Features:
 * - Relative positioning for proper layout handling
 * - Selection state visual feedback through shadow effects
 * - Hover state indication with subtle ring outline
 * - Keyboard focus support via tabIndex
 * - Flexible className composition using cn utility
 * 
 * The component uses React.forwardRef to properly handle ref forwarding, which is essential
 * for DOM manipulation and third-party library integration.
 *
 * @param className - Additional CSS classes to merge with base styles
 * @param selected - Boolean indicating if the node is currently selected
 * @param props - Standard HTML div element props
 * @param ref - Forwarded ref for DOM access
 */
import React from "react";
import { cn } from "@/lib/utils";

export const BaseNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative",      // Enable relative positioning for child elements
      className,       // Merge custom classes
      selected ? "shadow-lg" : "",  // Add elevation shadow when selected
      "hover:ring-1",  // Show subtle ring outline on hover
    )}
    tabIndex={0}      // Make the node focusable for keyboard navigation
    {...props}
  ></div>
));
BaseNode.displayName = "BaseNode";
