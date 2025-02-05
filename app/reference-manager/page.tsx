'use client'

import { LeftSidebar } from "./components/left-sidebar"
import { RightSidebar } from './components/right-sidebar'

/**
 * ReferenceManager component serves as the main interface for managing references
 * Orchestrates the layout of sidebars and main content area while maintaining
 * consistent spacing and viewport calculations
 */
export default function ReferenceManager() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      <LeftSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {/* Reference list content will go here */}
      </div>

      <RightSidebar />
    </div>
  )
}
