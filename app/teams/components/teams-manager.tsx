"use client"

import { useState } from "react"
import { 
  Users, 
  UsersRound, 
  Layers,
  HelpCircle,
  SidebarClose,
  SidebarOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersManagement } from "./users-management"
import { GroupsManagement } from "./groups-management"
import { TeamsManagement } from "./teams-management"

/**
 * TeamsManager Component
 * 
 * A comprehensive interface for managing all aspects of team organization including:
 * - Teams: Cross-functional groups with assigned leads and members
 * - Groups: Functional units within the organization
 * - Users: Individual team members with roles and assignments
 * 
 * This component serves as the central hub for the team management system, featuring:
 * - Collapsible sidebars for maximizing workspace
 * - Contextual navigation between management interfaces
 * - Detailed help and information panels
 * - Responsive design supporting various device sizes
 */
export function TeamsManager() {
  // State for sidebar visibility and active tab selection
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'teams' | 'groups' | 'users'>('teams')

  /**
   * Renders the left sidebar component
   * Provides navigation between different management interfaces
   * Can be collapsed to maximize workspace
   * @returns JSX for the left sidebar
   */
  const renderLeftSidebar = () => {
    if (!isLeftSidebarOpen) {
      return (
        <div className="absolute left-0 top-[57px] z-50">
          <button
            onClick={() => setIsLeftSidebarOpen(true)}
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
          onClick={() => setIsLeftSidebarOpen(false)}
          className="absolute left-full top-4 bg-white p-2 rounded-r-md shadow-md z-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold mb-4">Teams Management</h2>
          
          <div className="border rounded-md divide-y">
            <div 
              className={cn(
                "flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer",
                activeTab === 'teams' ? 'bg-gray-50' : ''
              )}
              onClick={() => setActiveTab('teams')}
            >
              <Layers className="h-4 w-4 mr-2 text-gray-700" />
              <span className="text-sm font-medium">Teams</span>
            </div>
            <div 
              className={cn(
                "flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer",
                activeTab === 'groups' ? 'bg-gray-50' : ''
              )}
              onClick={() => setActiveTab('groups')}
            >
              <UsersRound className="h-4 w-4 mr-2 text-gray-700" />
              <span className="text-sm font-medium">Groups</span>
            </div>
            <div 
              className={cn(
                "flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer",
                activeTab === 'users' ? 'bg-gray-50' : ''
              )}
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-4 w-4 mr-2 text-gray-700" />
              <span className="text-sm font-medium">Users</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Renders the right sidebar component
   * Provides contextual help and information based on the active tab
   * Can be collapsed to maximize workspace
   * @returns JSX for the right sidebar
   */
  const renderRightSidebar = () => {
    if (!isRightSidebarOpen) {
      return (
        <div className="absolute right-0 top-[57px] z-50">
          <button
            onClick={() => setIsRightSidebarOpen(true)}
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
          onClick={() => setIsRightSidebarOpen(false)}
          className="absolute right-full top-4 bg-white p-2 rounded-l-md shadow-md z-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="space-y-6 h-full overflow-auto">
          <h2 className="text-lg font-semibold flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            Help & Info
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'teams' && "Teams Management"}
                {activeTab === 'groups' && "Groups Management"}
                {activeTab === 'users' && "User Management"}
              </CardTitle>
              <CardDescription>
                {activeTab === 'teams' && "Create and manage cross-functional teams."}
                {activeTab === 'groups' && "Organize functional groups for your teams."}
                {activeTab === 'users' && "Manage team members and their assignments."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                {activeTab === 'teams' && (
                  <>
                    <p>This panel allows you to:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Create cross-functional teams</li>
                      <li>Assign team leads for coordination</li>
                      <li>Add multiple groups to teams</li>
                      <li>Manage team composition and structure</li>
                    </ul>
                  </>
                )}
                {activeTab === 'groups' && (
                  <>
                    <p>This panel allows you to:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Create new functional groups</li>
                      <li>Edit group details and purpose</li>
                      <li>View group members</li>
                      <li>Delete groups when no longer needed</li>
                    </ul>
                  </>
                )}
                {activeTab === 'users' && (
                  <>
                    <p>This panel allows you to:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Create and manage team members</li>
                      <li>Edit user details and roles</li>
                      <li>Assign users to functional groups</li>
                      <li>Maintain user information</li>
                    </ul>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {renderLeftSidebar()}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'teams' && <TeamsManagement />}
          {activeTab === 'groups' && <GroupsManagement />}
          {activeTab === 'users' && <UsersManagement />}
        </div>
      </div>
      
      {renderRightSidebar()}
    </div>
  )
} 