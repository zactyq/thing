'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, InfoIcon, HelpCircle, MapPin, Activity } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface RightSidebarProps {
  isOpen: boolean
  onToggle: () => void
  activeSection: string
}

/**
 * RightSidebar Component for Reference Manager
 * 
 * A collapsible sidebar that displays contextual information and help
 * based on the currently active section in the reference manager.
 * This provides users with guidance on how to use each management interface.
 * 
 * Features:
 * - Context-aware content based on active section
 * - Collapsible design to maximize workspace
 * - Help and information for each management section
 * 
 * Props:
 * @param isOpen - Controls the expanded/collapsed state of the sidebar
 * @param onToggle - Callback function to toggle the sidebar state
 * @param activeSection - The currently active section ID
 */
export function RightSidebar({ isOpen, onToggle, activeSection }: RightSidebarProps) {
  // Early return for collapsed state
  if (!isOpen) {
    return (
      <div className="absolute right-0 top-[57px] z-50">
        <button
          onClick={onToggle}
          className="absolute right-0 top-4 bg-white p-2 rounded-l-md shadow-md"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4 relative z-40">
      <button
        onClick={onToggle}
        className="absolute right-full top-4 bg-white p-2 rounded-l-md shadow-md z-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="space-y-6 h-full overflow-auto">
        <h2 className="text-lg font-semibold flex items-center">
          <HelpCircle className="mr-2 h-5 w-5" />
          Help & Info
        </h2>
        
        {activeSection === 'places' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="font-medium flex items-center text-blue-700">
                <MapPin className="h-4 w-4 mr-2" />
                About Places Management
              </h3>
              <p className="mt-2 text-sm text-blue-700">
                Places represent physical locations that can be selected in the Space Builder.
                Add, edit, and manage places that will appear in the Space Builder dropdown.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Managing Places</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="font-medium">Add:</span> 
                  <span>Click &quot;Add Place&quot; to create a new location</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Edit:</span> 
                  <span>Use the pencil icon to modify an existing place</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Delete:</span> 
                  <span>Click the trash icon to remove a place</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {activeSection === 'statuses' && (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
              <h3 className="font-medium flex items-center text-purple-700">
                <Activity className="h-4 w-4 mr-2" />
                About Status Management
              </h3>
              <p className="mt-2 text-sm text-purple-700">
                Statuses represent operational states that can be assigned to assets or spaces.
                Create and manage statuses with different priorities, colors, and categories.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Managing Statuses</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="font-medium">Add:</span> 
                  <span>Click &quot;Add Status&quot; to create a new status</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Edit:</span> 
                  <span>Use the pencil icon to modify an existing status</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Delete:</span> 
                  <span>Click the trash icon to remove a status</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Colors:</span> 
                  <span>Choose colors to visually represent different statuses</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Priority:</span> 
                  <span>Set priority levels from High (1) to Low (5)</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {activeSection === 'settings' && (
          <div className="text-gray-500 italic flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            <span>Settings information will appear here</span>
          </div>
        )}
      </div>
    </div>
  )
}