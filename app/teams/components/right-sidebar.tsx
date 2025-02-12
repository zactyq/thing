"use client"

import { ChevronLeft, ChevronRight, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface RightSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

/**
 * RightSidebar Component for Teams Manager
 * 
 * A collapsible sidebar that displays detailed information and settings
 * for the currently selected team or team member. When collapsed, it
 * preserves screen space while maintaining accessibility through a
 * toggle button.
 * 
 * Props:
 * @param isOpen - Controls the expanded/collapsed state of the sidebar
 * @param onToggle - Callback function to toggle the sidebar state
 */
export function RightSidebar({ isOpen, onToggle }: RightSidebarProps) {
  // Early return for collapsed state
  if (!isOpen) {
    return (
      <div className="absolute right-0 top-[57px] z-50">
        <button
          onClick={onToggle}
          className="absolute right-0 top-4 bg-white p-2 rounded-l-md shadow-md"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 relative z-40">
      <button
        onClick={onToggle}
        className="absolute right-full top-4 bg-white p-2 rounded-l-md shadow-md z-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Properties</h2>
        
        <div className="text-gray-500 italic flex items-center gap-2">
          <InfoIcon className="h-4 w-4" />
          <span>Select a team to edit its properties</span>
        </div>
      </div>
    </div>
  )
} 