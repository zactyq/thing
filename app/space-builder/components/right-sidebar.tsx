import type React from "react"
import type { Node } from "reactflow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, InfoIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SpaceBuilderService } from "@/lib/services/space-builder-service"
import type { AssetType, NodeData } from "@/lib/types/space-builder"

// Initialize service
const spaceBuilderService = new SpaceBuilderService()

/**
 * Props for the RightSidebar component
 * @param selectedNode - Currently selected node in the flow editor, null if no selection
 * @param onUpdateNode - Callback function to update node properties when edited
 */
interface RightSidebarProps {
  selectedNode: Node<NodeData> | null
  onUpdateNode: (node: Node<NodeData>) => void
  isOpen: boolean
  onToggle: () => void
  nodes: Node<NodeData>[]
  onGroupChange: (groupId: string) => void
}

/**
 * RightSidebar component displays and allows editing of node properties
 * Features:
 * - Shows basic properties like label and type
 * - For asset nodes, allows assigning to a group via dropdown
 * - Collapsible interface for better space management
 */
export function RightSidebar({ selectedNode, onUpdateNode, isOpen, onToggle, nodes }: RightSidebarProps) {
  // Track all temporary changes
  const [tempLabel, setTempLabel] = useState("")
  const [tempTypeId, setTempTypeId] = useState("")
  const [tempGroupId, setTempGroupId] = useState<string | null>(null)
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

  // Initialize temp values when selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      setTempLabel(selectedNode.data.label || '')
      setTempTypeId(selectedNode.data.typeId || '')
      setTempGroupId(selectedNode.data.groupId || null)
    }
  }, [selectedNode])

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempLabel(e.target.value)
  }

  const handleTypeChange = (value: string) => {
    setTempTypeId(value)
  }

  const handleGroupChange = (value: string) => {
    setTempGroupId(value === 'none' ? null : value)
  }

  // Save all changes at once with proper nesting
  const handleSaveChanges = () => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        parentNode: tempGroupId || undefined,
        extent: tempGroupId ? ('parent' as const) : undefined,
        position: tempGroupId ? { x: 50, y: 50 } : selectedNode.position,
        data: {
          ...selectedNode.data,
          label: tempLabel,
          typeId: tempTypeId,
          groupId: tempGroupId,
          parentId: tempGroupId || undefined
        },
      }
      onUpdateNode(updatedNode)
    }
  }

  // Reset all temp values to current node values
  const handleCancel = () => {
    if (selectedNode) {
      setTempLabel(selectedNode.data.label || '')
      setTempTypeId(selectedNode.data.typeId || '')
      setTempGroupId(selectedNode.data.groupId || null)
    }
  }

  // Filter for active asset types only
  const availableAssetTypes = assetTypes.filter(asset => asset.isActive)

  return (
    <div className={`bg-gray-100 p-4 transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-12"}`}>
      <div className="flex justify-between items-center mb-6">
        {isOpen && <h2 className="text-2xl font-semibold">Properties</h2>}
        <Button variant="ghost" size="icon" onClick={onToggle}>
          {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {isOpen && selectedNode && (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex-grow space-y-6 overflow-y-auto pb-6">
            <div className="space-y-2">
              <Label htmlFor="label" className="text-base font-normal">Label</Label>
              <Input 
                id="label" 
                name="label" 
                value={tempLabel} 
                onChange={handleLabelChange}
              />
            </div>
            
            {selectedNode.type === 'asset' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="type" className="text-base font-normal">Type</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add new asset types using the reference manager</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={tempTypeId}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAssetTypes.map((assetType) => (
                      <SelectItem key={assetType.id} value={assetType.id}>
                        {assetType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedNode.type === 'asset' && (
              <div className="space-y-2">
                <Label htmlFor="group" className="text-base font-normal">Group</Label>
                <Select
                  value={tempGroupId || 'none'}
                  onValueChange={handleGroupChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Group</SelectItem>
                    {nodes.filter(node => node.type === 'group').map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.data.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 pb-4 border-t bg-gray-100 mt-auto sticky bottom-0">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges}
            >
              Save
            </Button>
          </div>
        </div>
      )}
      {isOpen && !selectedNode && <p>Select a node to view and edit its properties.</p>}
    </div>
  )
}

