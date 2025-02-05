import { SpaceBuilder } from "./space-builder/components/space-builder"

/**
 * Home component serves as the main page of the application
 * Renders the SpaceBuilder component in a full-viewport container
 * Height calculation:
 * - 100vh represents full viewport height
 * - Subtracts 3.5rem (56px) for the header height
 * - Subtracts 1rem (16px) for the bottom margin/padding
 */
export default function Home() {
  return (
    <main className="h-[calc(100vh-3.5rem)] flex-1">
      <SpaceBuilder />
    </main>
  )
}

