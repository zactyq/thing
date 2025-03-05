import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText, Wrench, Mail, Phone, Database, Printer, Save, Download, Upload, Bell, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NodeData } from '@/app/process-builder/types';

/**
 * ActionNode represents an operation to be performed in a workflow
 * 
 * Actions are tasks that the system executes when the workflow reaches this node.
 * This component visualizes action nodes in the workflow builder with a distinctive
 * appearance and provides both input and output connection handles for creating
 * sequential operations in the workflow.
 * 
 * Examples of actions include:
 * - Sending notifications (emails, SMS, push notifications)
 * - Data operations (database updates, file generation)
 * - Integration actions (API calls, webhook triggers)
 * - System operations (logging, analytics recording)
 * 
 * @param props - The node props from ReactFlow, containing the node data
 */
function ActionNode({ data }: NodeProps<NodeData>) {
  // Map icon string to the corresponding Lucide icon component
  const getIcon = () => {
    switch (data.icon) {
      case 'FileText': return <FileText className="h-4 w-4 text-green-500" />;
      case 'Wrench': return <Wrench className="h-4 w-4 text-green-500" />;
      case 'Mail': return <Mail className="h-4 w-4 text-green-500" />;
      case 'Phone': return <Phone className="h-4 w-4 text-green-500" />;
      case 'Database': return <Database className="h-4 w-4 text-green-500" />;
      case 'Printer': return <Printer className="h-4 w-4 text-green-500" />;
      case 'Save': return <Save className="h-4 w-4 text-green-500" />;
      case 'Download': return <Download className="h-4 w-4 text-green-500" />;
      case 'Upload': return <Upload className="h-4 w-4 text-green-500" />;
      case 'Bell': return <Bell className="h-4 w-4 text-green-500" />;
      case 'BarChart': return <BarChart className="h-4 w-4 text-green-500" />;
      default: return <Wrench className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card className={cn("w-[220px] border-2 border-green-200 shadow-md")}>
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-600 text-xs">Action</Badge>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <CardDescription className="text-xs">{data.description}</CardDescription>
      </CardContent>
      
      {/* Input handle for connecting from previous nodes */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-green-500"
      />
      
      {/* Output handle for connecting to the next node */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500"
      />
    </Card>
  );
}

export default memo(ActionNode); 