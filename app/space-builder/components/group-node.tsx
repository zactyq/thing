/**
 * GroupNode Component
 * 
 * A specialized node type that can contain other nodes and provides visual grouping functionality.
 * This component extends the base LabeledGroupNode with additional features specific to the space builder:
 * 
 * Key Features:
 * - Resizable container with minimum dimensions
 * - Connection handles on top and bottom for parent-child relationships
 * - Top handle represents parent connections (target)
 * - Bottom handle represents child connections (source)
 * - Visual styling with semi-transparent background and borders
 * - Selection state handling with resize controls
 * 
 * The component uses React's memo to optimize re-renders, only updating when props change.
 */

import { memo } from 'react'
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow'
import { LabeledGroupNode } from '@/components/labeled-group-node'
import type { NodeData } from "@/lib/types/space-builder"

// Define the expected data structure for group nodes
interface GroupNodeData {
  label: string      // Display text for the group
  type: string       // Node type identifier
  width?: number     // Optional width override
  height?: number    // Optional height override
}

// Props interface for the labeled group node subcomponent
interface LabeledGroupNodeProps {
  id: string;        // Unique identifier for the node
  data: GroupNodeData; // Node configuration data
  selected: boolean;   // Whether node is currently selected
  className?: string; // Optional styling classes
}

const GroupNode = memo(({ id, data, selected }: NodeProps<NodeData>) => {
  return (
    <div className="bg-white/50 border-2 border-gray-200 rounded-lg">
      <div className="font-medium text-sm text-gray-700">{data.label}</div>
    </div>
  )
})

// Set display name for debugging purposes
GroupNode.displayName = 'GroupNode'

export default GroupNode 