import { memo } from "react"
import type { NodeData } from "@/lib/types/space-builder"

interface LabeledGroupNodeProps {
  data: NodeData;
  className?: string;
}

/**
 * LabeledGroupNode Component
 * A styled container node that can hold other nodes within it
 * Provides visual grouping and organization of nodes with a label
 */
const LabeledGroupNode = memo(({ data, className = "" }: LabeledGroupNodeProps) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="font-medium text-sm text-gray-700">{data.label}</div>
    </div>
  )
})

LabeledGroupNode.displayName = "LabeledGroupNode"

export { LabeledGroupNode }
