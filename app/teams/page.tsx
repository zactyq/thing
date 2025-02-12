"use client"

import { TeamsManager } from "./components/teams-manager"

/**
 * Teams Page Component
 * 
 * This is the main entry point for the teams management functionality.
 * It serves as a container for the TeamsManager component which handles
 * all team-related operations and displays.
 */
export default function TeamsPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <TeamsManager />
    </div>
  )
} 