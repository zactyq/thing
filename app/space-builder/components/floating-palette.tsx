import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Folder } from "lucide-react"
import { SpaceBuilderService } from "@/lib/services/space-builder-service"
import type { AssetType } from "@/lib/types/space-builder"
import { iconMap } from "@/lib/utils/icon-map"

interface FloatingPaletteProps {
  onAddNode: (type: string, nodeType: "asset" | "group") => void
}

// Initialize service
const spaceBuilderService = new SpaceBuilderService()

/**
 * FloatingPalette component provides a toolbar of node types that can be added to the canvas
 * Shows group creation button first, followed by all active asset types from the organization's database
 */
export function FloatingPalette({ onAddNode }: FloatingPaletteProps) {
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([])

  // Load asset types when component mounts
  useEffect(() => {
    const loadAssetTypes = async () => {
      try {
        const { assetTypes } = await spaceBuilderService.getAssetTypes()
        setAssetTypes(assetTypes)
      } catch (error) {
        console.error('Failed to load asset types:', error)
      }
    }
    loadAssetTypes()
  }, [])

  return (
    <div className="bg-white rounded-md shadow-md p-2 flex space-x-2">
      {/* Group button appears first with inverse colors */}
      <Button onClick={() => onAddNode("Group", "group")} size="icon" variant="default">
        <Folder className="h-4 w-4" />
      </Button>

      {/* Dynamic asset type buttons */}
      {assetTypes
        .filter(asset => asset.isActive)
        .map(asset => {
          const Icon = iconMap[asset.icon as keyof typeof iconMap]
          if (!Icon) return null
          
          return (
            <Button
              key={asset.id}
              onClick={() => onAddNode(asset.id, "asset")}
              size="icon"
              variant="outline"
              title={asset.name}
            >
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}
    </div>
  )
}


