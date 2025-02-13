'use client'

import { useState } from 'react'
import { LeftSidebar } from './components/left-sidebar'
import { RightSidebar } from './components/right-sidebar'

/**
 * ReferenceManager Page Component
 * 
 * The main container for the reference management interface.
 * Manages the state of both sidebars and provides the main content area.
 * Layout follows the same pattern as other manager pages for consistency.
 */
export default function ReferenceManagerPage() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <div className="flex h-full">
        <LeftSidebar 
          isOpen={isLeftSidebarOpen}
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full w-full bg-background/50 p-4">
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Reference Manager Content
            </div>
          </div>
        </main>

        <RightSidebar 
          isOpen={isRightSidebarOpen}
          onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        />
      </div>
    </div>
  )
}
