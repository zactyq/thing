import { SpaceBuilder } from "./components/space-builder"

/**
 * SpaceBuilderPage component serves as the route page for the space builder tool
 * Features:
 * - Maintains consistent viewport height calculations
 * - Renders the SpaceBuilder component as the main content
 * - Height calculation matches the main layout (100vh - header height)
 */
export default function SpaceBuilderPage() {
  return (
    <main className="h-[calc(100vh-3.5rem)] flex-1">
      <SpaceBuilder />
    </main>
  )
} 