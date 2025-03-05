'use client'

import { useState } from 'react'
import { LeftSidebar } from './components/left-sidebar'
import { RightSidebar } from './components/right-sidebar'
import { PlacesManager } from './components/places-manager'
import { StatusesManager } from './components/statuses-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Settings, Cog, Home, LucideIcon, Activity } from 'lucide-react'

// Types for the content sections
interface ContentSection {
  id: string
  label: string
  icon: LucideIcon
  component: React.ReactNode
}

/**
 * ReferenceManager Page Component
 * 
 * The main container for the reference management interface.
 * Manages the state of both sidebars and provides the main content area
 * with a tabbed interface for different management functions.
 * 
 * Features:
 * - Collapsible left and right sidebars
 * - Tabbed interface for different management sections
 * - Places management for the space builder
 * - Status management for tracking operational states
 * - Future expandability for additional reference types
 */
export default function ReferenceManagerPage() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('places')

  // Define content sections
  const contentSections: ContentSection[] = [
    {
      id: 'places',
      label: 'Places',
      icon: MapPin,
      component: <PlacesManager />
    },
    {
      id: 'statuses',
      label: 'Statuses',
      icon: Activity,
      component: <StatusesManager />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Cog,
      component: (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Reference Manager Settings (Coming Soon)
        </div>
      )
    }
  ]

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <div className="flex h-full">
        <LeftSidebar 
          isOpen={isLeftSidebarOpen}
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          sections={contentSections}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="h-full w-full bg-background/50 p-4">
            {contentSections.map((section) => (
              section.id === activeSection && (
                <div key={section.id} className="h-full">
                  {section.component}
                </div>
              )
            ))}
          </div>
        </main>

        <RightSidebar 
          isOpen={isRightSidebarOpen}
          onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          activeSection={activeSection}
        />
      </div>
    </div>
  )
}
