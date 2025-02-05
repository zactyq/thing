import type { Node } from "reactflow"
import { ChevronLeft, ChevronRight, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import type { NodeData } from "@/lib/types/space-builder"
import { SpaceBuilderService } from "@/lib/services/space-builder-service"
import { iconMap } from "@/lib/utils/icon-map"
import type { LucideIcon } from "lucide-react"

interface LeftSidebarProps {
  nodes: Node<NodeData>[]
  isOpen: boolean
  onToggle: () => void
  selectedNode: Node<NodeData> | null
  onNodeSelect: (node: Node<NodeData>) => void
}

// Initialize service
const spaceBuilderService = new SpaceBuilderService()

/**
 * LeftSidebar component displays a hierarchical view of nodes and groups
 * Similar to a file manager interface, showing groups as folders and nodes as files
 */
export function LeftSidebar({ nodes, isOpen, onToggle, selectedNode, onNodeSelect }: LeftSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [assetTypes, setAssetTypes] = useState<Record<string, { id: string; icon: string }>>({})

  // Load asset types and their icons when component mounts
  useEffect(() => {
    const loadAssetTypes = async () => {
      try {
        const { assetTypes } = await spaceBuilderService.getAssetTypes()
        // Create a lookup map for asset types
        const assetTypeMap = Object.fromEntries(
          assetTypes.map(type => [type.id, type])
        )
        setAssetTypes(assetTypeMap)
      } catch (error) {
        console.error('Failed to load asset types:', error)
      }
    }
    loadAssetTypes()
  }, [])

  // Auto-expand all groups initially
  useEffect(() => {
    const groupIds = nodes
      .filter(node => node.type === "group")
      .map(node => node.id)
    setExpandedGroups(new Set(groupIds))
  }, [nodes])

  const toggleGroup = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent node selection when toggling group
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const getNodeIcon = (node: Node<NodeData>): LucideIcon | null => {
    if (node.type === "group") {
      return expandedGroups.has(node.id) ? FolderOpen : Folder
    }
    
    if (node.data.typeId && assetTypes[node.data.typeId]) {
      const assetType = assetTypes[node.data.typeId]
      return iconMap[assetType.icon] || null
    }
    
    return null
  }

  const renderNodes = (nodes: Node<NodeData>[], parentId: string | null = null, level = 0) => {
    // Filter nodes that belong to this level
    const levelNodes = nodes.filter(node => 
      parentId === null ? !node.parentNode : node.parentNode === parentId
    )

    return levelNodes.map((node) => {
      const isGroup = node.type === "group"
      const isExpanded = expandedGroups.has(node.id)
      const hasChildren = nodes.some(n => n.parentNode === node.id)
      const Icon = getNodeIcon(node)
      const isSelected = selectedNode?.id === node.id

      return (
        <div key={node.id} style={{ marginLeft: `${level * 16}px` }}>
          <div 
            className={`flex items-center py-1 px-2 hover:bg-gray-200 rounded-md cursor-pointer group
              ${isSelected ? 'bg-gray-200' : ''}`}
            onClick={() => onNodeSelect(node)}
          >
            <div 
              className="flex items-center text-gray-700"
              onClick={(e) => isGroup && toggleGroup(node.id, e)}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
            </div>
            <span className="text-sm">
              {node.data.label}
            </span>
          </div>
          {isGroup && isExpanded && hasChildren && renderNodes(nodes, node.id, level + 1)}
        </div>
      )
    })
  }

  return (
    <div 
      className={`bg-gray-100 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-12"
      }`}
    >
      <div className="flex justify-between items-center p-4">
        {isOpen && <h2 className="text-xl font-semibold">Structure</h2>}
        <Button variant="ghost" size="icon" onClick={onToggle}>
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      {isOpen && (
        <div className="px-2 py-2">
          {renderNodes(nodes)}
          {nodes.length === 0 && (
            <div className="text-sm text-gray-500 p-2">
              No nodes available
            </div>
          )}
        </div>
      )}
    </div>
  )
}

