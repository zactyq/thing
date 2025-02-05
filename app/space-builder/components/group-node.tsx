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

const GroupNode = memo(({ id, data, selected }: NodeProps<GroupNodeData>) => {
  return (
    <>
      {/* Base group node component providing core grouping functionality */}
      <LabeledGroupNode
        id={id}
        data={data}
        selected={selected}
        className="border-2 border-gray-300 bg-white/50 rounded-lg"
      />

      {/* Resize controls that appear when node is selected */}
      <NodeResizer
        minWidth={200}      // Prevent groups from becoming too small
        minHeight={100}     // Maintain minimum usable height
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="h-3 w-3 bg-white border-2 border-blue-400 rounded"
      />
      
      {/* Connection points for hierarchical relationships */}
      {/* Top connection point for parent links (target) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-blue-400 border-2 border-white"
      />
      {/* Bottom connection point for child links (source) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-blue-400 border-2 border-white"
      />
    </>
  )
})

// Set display name for debugging purposes
GroupNode.displayName = 'GroupNode'

export default GroupNode 