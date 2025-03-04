import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText, Wrench, Mail, Phone, Database, Printer, Save, Download, Upload } from 'lucide-react';

/**
 * ActionNode represents an operation to be performed in a workflow
 * Actions are tasks that the system executes when workflow reaches this node
 * Examples include: sending notifications, updating database records, generating reports, etc.
 */
function ActionNode({ data }: NodeProps) {
  // Map of available icons for different action types
  const iconMap: Record<string, React.ReactNode> = {
    FileText: <FileText className="h-4 w-4" />,
    Wrench: <Wrench className="h-4 w-4" />,
    Mail: <Mail className="h-4 w-4" />,
    Phone: <Phone className="h-4 w-4" />,
    Database: <Database className="h-4 w-4" />,
    Printer: <Printer className="h-4 w-4" />,
    Save: <Save className="h-4 w-4" />,
    Download: <Download className="h-4 w-4" />,
    Upload: <Upload className="h-4 w-4" />,
  };

  // Get the icon based on the data or use a default
  const Icon = data.icon && iconMap[data.icon] ? iconMap[data.icon] : <FileText className="h-4 w-4" />;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-md p-3 min-w-[150px] shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-slate-100 rounded text-slate-600">
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
        className="w-2 h-2 bg-slate-500"
      />
      
      {/* Output connection handle at the bottom - can continue to next action */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="b"
        className="w-2 h-2 bg-slate-500"
      />
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ActionNode); 