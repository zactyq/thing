import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AlertCircle, Filter, GitBranch, Search, Eye, CheckCircle } from 'lucide-react';

/**
 * ConditionNode represents a decision point in a workflow
 * Conditions evaluate data and determine the path of workflow execution
 * They create branching logic based on criteria evaluation
 */
function ConditionNode({ data }: NodeProps) {
  // Map of available icons for different condition types
  const iconMap: Record<string, React.ReactNode> = {
    AlertCircle: <AlertCircle className="h-4 w-4" />,
    Filter: <Filter className="h-4 w-4" />,
    GitBranch: <GitBranch className="h-4 w-4" />,
    Search: <Search className="h-4 w-4" />,
    Eye: <Eye className="h-4 w-4" />,
    CheckCircle: <CheckCircle className="h-4 w-4" />,
  };

  // Get the icon based on the data or use a default
  const Icon = data.icon && iconMap[data.icon] ? iconMap[data.icon] : <AlertCircle className="h-4 w-4" />;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 min-w-[150px] shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-blue-100 rounded text-blue-600">
          {Icon}
        </div>
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      
      {data.description && (
        <div className="text-xs text-gray-500 mb-2">{data.description}</div>
      )}
      
      {/* Input connection handle at the top */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="a" 
        className="w-2 h-2 bg-blue-500"
      />
      
      {/* Output connection handles at the bottom - multiple paths possible */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="b" 
        className="w-2 h-2 bg-blue-500 -ml-4"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="c" 
        className="w-2 h-2 bg-blue-500 ml-4"
      />
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ConditionNode); 