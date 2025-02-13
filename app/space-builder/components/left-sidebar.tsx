import type { Node } from "reactflow"
import { ChevronLeft, ChevronRight, Folder, FolderOpen, Check, ChevronsUpDown } from "lucide-react"
import { useState, useEffect } from "react"
import type { NodeData } from "@/lib/types/space-builder"
import { SpaceBuilderService } from "@/lib/services/space-builder-service"
import { iconMap } from "@/lib/utils/icon-map"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface LeftSidebarProps {
  nodes: Node<NodeData>[]
  isOpen: boolean
  onToggle: () => void
  selectedNode: Node<NodeData> | null
  onNodeSelect: (node: Node<NodeData>) => void
}

// Initialize service
const spaceBuilderService = new SpaceBuilderService()

// Define frameworks data for the combobox
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

/**
 * LeftSidebar component displays a hierarchical view of nodes and groups
 * Similar to a file manager interface, showing groups as folders and nodes as files
 */
export function LeftSidebar({ nodes, isOpen, onToggle, selectedNode, onNodeSelect }: LeftSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [assetTypes, setAssetTypes] = useState<Record<string, { id: string; icon: string }>>({})
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

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

  // Early return for collapsed state
  if (!isOpen) {
    return (
      <div className="absolute left-0 top-[57px] z-50">
        <button
          onClick={onToggle}
          className="absolute left-0 top-4 bg-white p-2 rounded-r-md shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  const renderNodes = (nodes: Node<NodeData>[], parentId: string | null = null, level = 0) => {
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
            className={`flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer
              ${isSelected ? 'bg-gray-50' : ''}`}
            onClick={() => onNodeSelect(node)}
          >
            <div 
              className="flex items-center text-gray-700"
              onClick={(e) => isGroup && toggleGroup(node.id, e)}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
            </div>
            <span className="text-sm font-medium">
              {node.data.label}
            </span>
          </div>
          {isGroup && isExpanded && hasChildren && renderNodes(nodes, node.id, level + 1)}
        </div>
      )
    })
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 relative z-40">
      <button
        onClick={onToggle}
        className="absolute left-full top-4 bg-white p-2 rounded-r-md shadow-md z-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="space-y-6">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? frameworks.find((framework) => framework.value === value)?.label
                : "Select framework..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      {framework.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === framework.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <div className="border rounded-md divide-y">
          {renderNodes(nodes)}
          {nodes.length === 0 && (
            <div className="text-sm text-gray-500 italic p-3">
              No nodes available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

