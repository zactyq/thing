'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface LeftSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

/**
 * LeftSidebar Component for Reference Manager
 * 
 * A collapsible sidebar that provides navigation and management
 * of references and reference categories. When collapsed, it maintains
 * minimal visual presence while still providing access to core
 * functionality through icons.
 * 
 * Props:
 * @param isOpen - Controls the expanded/collapsed state of the sidebar
 * @param onToggle - Callback function to toggle the sidebar state
 */
export function LeftSidebar({ isOpen, onToggle }: LeftSidebarProps) {
  // Early return for collapsed state
  if (!isOpen) {
    return (
      <div className="absolute left-0 top-[57px] z-50">
        <button
          onClick={onToggle}
          className="absolute left-0 top-4 bg-white p-2 rounded-r-md shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 relative z-40">
      <button
        onClick={onToggle}
        className="absolute left-full top-4 bg-white p-2 rounded-r-md shadow-md z-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">References</h2>
        
        <div className="border rounded-md divide-y">
          {/* Reference list will go here */}
          <div className="text-sm text-gray-500 italic p-3">
            No references available
          </div>
        </div>
      </div>
    </div>
  )
}