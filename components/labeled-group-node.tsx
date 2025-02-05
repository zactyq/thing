import { Node, NodeProps } from "@xyflow/react";
import { BaseNode } from "@/components/base-node";
import { cn } from "@/lib/utils";

// Define the GroupNodeData type
type GroupNodeData = {
  label: string;
};

type LabeledGroupNode = Node<{
  label: string;
}>;

interface LabeledGroupNodeProps {
  id: string;
  data: GroupNodeData;
  selected: boolean;
  className?: string;
}

export const LabeledGroupNode: React.FC<LabeledGroupNodeProps> = ({ 
  id, 
  data, 
  selected, 
  className 
}) => {
  return (
    <BaseNode
      selected={selected}
      className={cn(
        'h-full w-full',
        '[&.card]:!p-0 [&.card]:!m-0',
        '!p-0 !m-0',
        className
      )}
    >
      {data.label && (
        <div className="absolute top-0 left-0 bg-gray-200 w-fit px-2 py-0.5 text-xs rounded-br-sm text-card-foreground !m-0" >
          {data.label}
        </div>
      )}
    </BaseNode>
  );
}

LabeledGroupNode.displayName = "LabeledGroupNode";
