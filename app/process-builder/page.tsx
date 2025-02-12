'use client'

import { useState } from 'react'
import { LeftSidebar } from '../process-builder/components/left-sidebar'
import { RightSidebar } from '../process-builder/components/right-sidebar'

/**
 * ProcessBuilder Page Component
 * 
 * The main container for the process flow building interface.
 * Manages the state of both sidebars and provides the main canvas area
 * for process flow design and configuration.
 * Layout follows the same pattern as other builder pages for consistency.
 */
export default function ProcessBuilderPage() {
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
              Process Builder Canvas
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