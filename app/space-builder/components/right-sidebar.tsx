import type React from "react"
import type { Node } from "reactflow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, InfoIcon, Pencil, SquareAsterisk } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect, useRef } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { NodeData } from "@/lib/types/space-builder"
import { AddFunctionModal, type FunctionConfig } from "./add-function-modal"

/**
 * Props for the RightSidebar component
 * @param selectedNode - Currently selected node in the flow editor, null if no selection
 * @param onUpdateNode - Callback function to update node properties when edited
 * @param isOpen - Whether the sidebar is expanded
 * @param onToggle - Function to toggle sidebar visibility
 * @param nodes - All nodes in the flow editor
 * @param onGroupChange - Callback for when a node's parent group changes
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
 * RightSidebar Component
 * Provides property editing and relationship management for selected nodes
 * 
 * Features:
 * - Node property editing (label, type)
 * - Parent group selection via dropdown
 * - Child nodes management and visualization
 * - Collapsible sidebar with toggle
 */
export function RightSidebar({
  selectedNode,
  onUpdateNode,
  isOpen,
  onToggle,
  nodes,
  onGroupChange,
}: RightSidebarProps) {
  // State for label editing
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [labelValue, setLabelValue] = useState("")
  const labelInputRef = useRef<HTMLInputElement>(null)
  const [isAddFunctionModalOpen, setIsAddFunctionModalOpen] = useState(false)

  // Update label value when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setLabelValue(selectedNode.data.label)
      setIsEditingLabel(false)
    }
  }, [selectedNode])

  // Handle label save
  const handleLabelSave = () => {
    if (selectedNode && labelValue.trim() !== "") {
      const updatedNode = {
        ...selectedNode,
        data: { 
          ...selectedNode.data, 
          label: labelValue.trim() 
        },
      }
      onUpdateNode(updatedNode)
      setIsEditingLabel(false)
    } else {
      // If empty, revert to original value
      setLabelValue(selectedNode?.data.label || "")
      setIsEditingLabel(false)
    }
  }

  // Handle label edit key press
  const handleLabelKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault() // Prevent form submission
      handleLabelSave()
    } else if (e.key === "Escape") {
      e.preventDefault() // Prevent any default behavior
      setLabelValue(selectedNode?.data.label || "")
      setIsEditingLabel(false)
    }
  }

  // Handle clicking outside of the input
  const handleBlur = () => {
    handleLabelSave()
  }

  // Handle adding a new function to the node
  const handleAddFunction = (functionConfig: FunctionConfig) => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          functions: [...(selectedNode.data.functions || []), functionConfig]
        }
      }
      onUpdateNode(updatedNode)
    }
  }

  // Handle removing a function from the node
  const handleRemoveFunction = (index: number) => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          functions: (selectedNode.data.functions || []).filter((_, i) => i !== index)
        }
      }
      onUpdateNode(updatedNode)
    }
  }

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

  // Get all available group nodes for parent selection
  // Filter out the current node (to prevent self-selection) and any descendant groups
  // to prevent circular relationships
  const getAvailableParentGroups = (currentNode: Node<NodeData>) => {
    const isDescendantOf = (node: Node<NodeData>, potentialAncestorId: string): boolean => {
      if (!node.parentNode) return false
      if (node.parentNode === potentialAncestorId) return true
      const parentNode = nodes.find(n => n.id === node.parentNode)
      return parentNode ? isDescendantOf(parentNode, potentialAncestorId) : false
    }

    return nodes.filter(node => 
      node.type === 'group' && 
      node.id !== currentNode.id && 
      !isDescendantOf(node, currentNode.id)
    )
  }

  // Get current parent and children relationships
  const parentNode = selectedNode?.parentNode 
    ? nodes.find(node => node.id === selectedNode.parentNode)
    : null

  const childNodes = nodes.filter(node => 
    node.parentNode === selectedNode?.id
  )

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 relative z-40">
      <button
        onClick={onToggle}
        className="absolute right-full top-4 bg-white p-2 rounded-l-md shadow-md z-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {selectedNode ? (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Properties</h2>
          
          {/* Basic Properties */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="node-label">Label</Label>
              <div className="relative">
                {isEditingLabel ? (
                  <Input
                    ref={labelInputRef}
                    id="node-label"
                    value={labelValue}
                    onChange={(e) => setLabelValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleLabelKeyPress}
                    className="pr-8"
                    autoFocus
                  />
                ) : (
                  <div 
                    className="flex items-center justify-between p-2 border rounded-md hover:border-input cursor-pointer group"
                    onClick={() => {
                      setIsEditingLabel(true)
                      setLabelValue(selectedNode?.data.label || "")
                      // Focus the input after a short delay to ensure it's mounted
                      setTimeout(() => labelInputRef.current?.focus(), 0)
                    }}
                  >
                    <span>{selectedNode?.data.label}</span>
                    <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>
            </div>

            {/* Parent Group Selection */}
            <div className="space-y-2">
              <Label>Parent Group</Label>
              <Select
                value={parentNode?.id || "none"}
                onValueChange={(value) => onGroupChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {getAvailableParentGroups(selectedNode).map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.data.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Child Nodes Display */}
            <div className="space-y-2">
              <Label>Child Nodes</Label>
              {childNodes.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {childNodes.map(child => (
                    <div 
                      key={child.id} 
                      className="p-2 flex justify-between items-center hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{child.data.label}</div>
                        <div className="text-sm text-gray-500">
                          {child.type === 'group' ? 'Group' : 'Asset'}
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onGroupChange("none")}
                            >
                              Remove
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove from group</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic border rounded-md p-3">
                  No child nodes
                </div>
              )}
            </div>

            {/* Functions Section */}
            <div className="space-y-2">
              <Label>Functions</Label>
              <div className="space-y-2">
                {/* List of configured functions */}
                {selectedNode.data.functions?.map((func, index) => (
                  <div 
                    key={index}
                    className="p-2 flex justify-between items-center border rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{func.type}</div>
                      <div className="text-sm text-gray-500">
                        ID: {func.pairingId}
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFunction(index)}
                          >
                            Remove
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove function</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}

                {/* Add function button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsAddFunctionModalOpen(true)}
                >
                  <SquareAsterisk className="h-4 w-4 mr-2" />
                  Add Function
                </Button>
              </div>
            </div>

            {/* Node Type Information */}
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center gap-1">
                  <span>Type:</span>
                  <span className="font-medium">{selectedNode.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>ID:</span>
                  <span className="font-mono text-xs">{selectedNode.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 italic flex items-center gap-2">
          <InfoIcon className="h-4 w-4" />
          <span>Select a node to edit its properties</span>
        </div>
      )}

      {/* Add Function Modal */}
      <AddFunctionModal
        isOpen={isAddFunctionModalOpen}
        onClose={() => setIsAddFunctionModalOpen(false)}
        onSave={handleAddFunction}
      />
    </div>
  )
}

