"use client"

import { TeamsManager } from './components/teams-manager'

/**
 * Teams Page
 * 
 * This page serves as the main entry point for the Teams Management system.
 * It renders the TeamsManager component which provides a comprehensive
 * interface for managing users, groups, and teams within the organization.
 * 
 * The TeamsManager component includes:
 * - User management (add, edit, delete users and assign to groups)
 * - Group management (create, edit, delete groups)
 * - Team management (create teams with leads and assigned groups)
 * 
 * This system is designed to be fully client-side and utilizes localStorage
 * for persistence, making it suitable for demonstrations and prototyping.
 */
export default function TeamsPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <TeamsManager />
    </div>
  )
} 