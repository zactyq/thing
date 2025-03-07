/**
 * GroupNode Component
 * 
 * A specialized node type that can contain other nodes and provides visual grouping functionality.
 * This component provides connection handles for the space builder.
 */

import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import type { NodeData } from "@/lib/types/space-builder"

const GroupNode = memo(({}: NodeProps<NodeData>) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-transparent !border-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-transparent !border-0"
      />
    </>
  )
})

GroupNode.displayName = 'GroupNode'

export default GroupNode 