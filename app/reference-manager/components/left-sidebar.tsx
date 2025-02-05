'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

/**
 * LeftSidebar Component
 * 
 * Provides a collapsible sidebar for reference categories, filters, and navigation
 * Styled to match the space builder's sidebar design
 */
export function LeftSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div 
      className={`bg-gray-100 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-12"
      }`}
    >
      <div className="flex justify-between items-center p-4">
        {isOpen && <h2 className="text-xl font-semibold">References</h2>}
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      {isOpen && (
        <div className="px-2 py-2">
          {/* Left sidebar content will go here */}
        </div>
      )}
    </div>
  )
}