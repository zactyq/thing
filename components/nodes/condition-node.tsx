import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AlertCircle, Filter, GitBranch, Search, Eye, CheckCircle, Thermometer, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NodeData } from '@/app/process-builder/types';

/**
 * ConditionNode represents a decision point in a workflow
 * 
 * Conditions evaluate data and determine the path of workflow execution.
 * This component visualizes condition nodes in the workflow builder with a distinctive
 * appearance and provides both input and output connection handles for creating
 * branching logic based on criteria evaluation.
 * 
 * Examples of conditions include:
 * - Data value comparisons (thresholds, equality checks)
 * - State evaluations (device status, connection state)
 * - Pattern matching (object detection, text analysis)
 * - Time-based conditions (time windows, durations)
 * 
 * @param props - The node props from ReactFlow, containing the node data
 */
function ConditionNode({ data }: NodeProps<NodeData>) {
  // Map icon string to the corresponding Lucide icon component
  const getIcon = () => {
    switch (data.icon) {
      case 'AlertCircle': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'Filter': return <Filter className="h-4 w-4 text-amber-500" />;
      case 'GitBranch': return <GitBranch className="h-4 w-4 text-amber-500" />;
      case 'Search': return <Search className="h-4 w-4 text-amber-500" />;
      case 'Eye': return <Eye className="h-4 w-4 text-amber-500" />;
      case 'CheckCircle': return <CheckCircle className="h-4 w-4 text-amber-500" />;
      case 'Thermometer': return <Thermometer className="h-4 w-4 text-amber-500" />;
      case 'Wifi': return <Wifi className="h-4 w-4 text-amber-500" />;
      default: return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <Card className={cn("w-[220px] border-2 border-amber-200 shadow-md")}>
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
        </div>
        <Badge variant="outline" className="bg-amber-50 text-amber-600 text-xs">Condition</Badge>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <CardDescription className="text-xs">{data.description}</CardDescription>
      </CardContent>
      
      {/* Input handle for connecting from previous nodes */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-amber-500"
      />
      
      {/* Output handle for connecting to the next node */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-amber-500"
      />
    </Card>
  );
}

export default memo(ConditionNode); 