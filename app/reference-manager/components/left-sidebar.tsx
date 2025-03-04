'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ContentSection {
  id: string
  label: string
  icon: LucideIcon
  component: React.ReactNode
}

interface LeftSidebarProps {
  isOpen: boolean
  onToggle: () => void
  activeSection: string
  onSectionChange: (sectionId: string) => void
  sections: ContentSection[]
}

/**
 * LeftSidebar Component for Reference Manager
 * 
 * A collapsible sidebar that provides navigation between different
 * management sections of the reference manager. It renders a list of
 * sections with icons and labels, allowing users to easily switch
 * between different management interfaces.
 * 
 * Features:
 * - Collapsible design to maximize workspace
 * - Visual indication of the active section
 * - Icon-based navigation for intuitive use
 * - Consistent styling with other application sidebars
 * 
 * Props:
 * @param isOpen - Controls the expanded/collapsed state of the sidebar
 * @param onToggle - Callback function to toggle the sidebar state
 * @param activeSection - The currently active section ID
 * @param onSectionChange - Callback to change the active section
 * @param sections - Array of content sections to display
 */
export function LeftSidebar({ 
  isOpen, 
  onToggle, 
  activeSection, 
  onSectionChange,
  sections 
}: LeftSidebarProps) {
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
    <div className="w-64 bg-white border-r border-gray-200 relative z-40">
      <button
        onClick={onToggle}
        className="absolute left-full top-4 bg-white p-2 rounded-r-md shadow-md z-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="p-4 h-full overflow-auto">
        <h2 className="text-lg font-semibold mb-6">Reference Manager</h2>
        
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm rounded-md",
                  activeSection === section.id 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-gray-100 text-gray-800"
                )}
              >
                <Icon className={cn("mr-2 h-4 w-4")} />
                <span>{section.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}