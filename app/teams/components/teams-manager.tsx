"use client"

import { useState } from "react"
import { LeftSidebar } from "./left-sidebar"
import { RightSidebar } from "./right-sidebar"
import { TeamsCanvas } from "./teams-canvas"

/**
 * TeamsManager Component
 * 
 * A comprehensive interface for managing teams and their relationships.
 * Features:
 * - Left sidebar: For team navigation and creation
 * - Main canvas: For visualizing team structures and relationships
 * - Right sidebar: For detailed team properties and settings
 * 
 * The layout follows a similar pattern to the space builder for consistency
 * across the application, including collapsible sidebars for better space
 * utilization.
 */
export function TeamsManager() {
  // State for controlling sidebar visibility
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)

  return (
    <div className="flex h-full">
      <LeftSidebar 
        isOpen={isLeftSidebarOpen}
        onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
      />
      
      <main className="flex-1 overflow-hidden">
        <TeamsCanvas />
      </main>

      <RightSidebar 
        isOpen={isRightSidebarOpen}
        onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />
    </div>
  )
} 