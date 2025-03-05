import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Camera, Bell, Mail, Clock, Smartphone, MessageSquare, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NodeData } from '@/app/process-builder/types';

/**
 * TriggerNode represents the starting point of a workflow
 * 
 * Triggers are events that initiate a workflow execution.
 * This component visualizes trigger nodes in the workflow builder with a distinctive
 * appearance and provides an output connection handle for linking to subsequent nodes.
 * 
 * Examples of triggers include:
 * - Sensor readings (IoT devices, cameras)
 * - Scheduled events (time-based triggers)
 * - Manual activations (user interactions)
 * - External system events (webhooks, API calls)
 * 
 * @param props - The node props from ReactFlow, containing the node data
 */
function TriggerNode({ data }: NodeProps<NodeData>) {
  // Map icon string to the corresponding Lucide icon component
  const getIcon = () => {
    switch (data.icon) {
      case 'Camera': return <Camera className="h-4 w-4 text-red-500" />;
      case 'Bell': return <Bell className="h-4 w-4 text-red-500" />;
      case 'Mail': return <Mail className="h-4 w-4 text-red-500" />;
      case 'Clock': return <Clock className="h-4 w-4 text-red-500" />;
      case 'Smartphone': return <Smartphone className="h-4 w-4 text-red-500" />;
      case 'MessageSquare': return <MessageSquare className="h-4 w-4 text-red-500" />;
      case 'MapPin': return <MapPin className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card className={cn("w-[220px] border-2 border-red-200 shadow-md")}>
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
        </div>
        <Badge variant="outline" className="bg-red-50 text-red-600 text-xs">Trigger</Badge>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <CardDescription className="text-xs">{data.description}</CardDescription>
      </CardContent>
      
      {/* Output handle for connecting to the next node */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-red-500"
      />
    </Card>
  );
}

export default memo(TriggerNode); 