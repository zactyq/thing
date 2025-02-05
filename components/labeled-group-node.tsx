import { memo } from "react"
import { NodeResizer, NodeProps } from 'reactflow'
import type { NodeData } from "@/lib/types/space-builder"

/**
 * LabeledGroupNode Component
 * A styled container node that can hold other nodes within it and support hierarchical relationships
 * 
 * Features:
 * - Visual grouping and organization of nodes with a label
 * - Clean, minimal container with single border
 * - Resizable container with minimum dimensions
 * - Visual feedback for selection state
 * - Title positioned inside at top-left
 */
const LabeledGroupNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  return (
    <>
      <NodeResizer
        minWidth={200}
        minHeight={150}
        isVisible={selected}
        lineClassName={`rounded-lg border-2 ${selected ? 'border-blue-400' : 'border-gray-300'}`}
        handleClassName="h-3 w-3 bg-white border-2 border-blue-400 rounded"
      />
      <div 
        className={`absolute inset-0 rounded-lg border-2 transition-colors
          ${selected ? 'border-blue-400' : 'border-gray-300'}`}
      >
        <div className="absolute top-2 left-2 text-sm font-medium text-gray-700">
          {data.label}
        </div>
      </div>
    </>
  )
})

LabeledGroupNode.displayName = "LabeledGroupNode"

export { LabeledGroupNode }
