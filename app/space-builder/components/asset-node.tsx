import { memo, useEffect, useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { SpaceBuilderService } from "@/lib/services/space-builder-service"
import type { AssetType } from "@/lib/types/space-builder"
import { iconMap } from "@/lib/utils/icon-map"

// Initialize service
const spaceBuilderService = new SpaceBuilderService()

/**
 * AssetNode Component
 * Renders a visual representation of a network asset in the topology diagram
 * Uses strictly typed Lucide icons for visual representation
 * 
 * @param data - Contains the asset's properties including type and label
 * @returns A React component representing the network asset with connection handles
 */
function AssetNode({ data }: NodeProps) {
  const [assetType, setAssetType] = useState<AssetType | undefined>()

  // Load asset type data when component mounts or typeId changes
  useEffect(() => {
    const loadAssetType = async () => {
      try {
        const { assetTypes } = await spaceBuilderService.getAssetTypes()
        const matchingType = assetTypes.find(type => type.id === data.typeId)
        setAssetType(matchingType)
      } catch (error) {
        console.error('Failed to load asset type:', error)
      }
    }
    loadAssetType()
  }, [data.typeId])

  // Get the icon component for this asset type
  const Icon = assetType?.icon ? iconMap[assetType.icon as keyof typeof iconMap] : null

  return (
    <div className="bg-white rounded-md shadow-md p-2 border border-gray-200">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center">
        {Icon && <Icon className="w-6 h-6" />}
        <div className="ml-2">
          <span className="text-sm font-medium">{data.label}</span>
          {assetType && (
            <span className="text-xs text-gray-500 block">
              {assetType.name}
            </span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default memo(AssetNode)

