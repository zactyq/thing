import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Camera, Bell, Mail, Clock, Smartphone, MessageSquare } from 'lucide-react';

/**
 * TriggerNode represents the starting point of a workflow
 * Triggers are events that initiate a workflow execution
 * Examples include: sensor readings, scheduled events, manual activations, etc.
 */
function TriggerNode({ data }: NodeProps) {
  // Map of available icons for different trigger types
  const iconMap: Record<string, React.ReactNode> = {
    Camera: <Camera className="h-4 w-4" />,
    Bell: <Bell className="h-4 w-4" />,
    Mail: <Mail className="h-4 w-4" />,
    Clock: <Clock className="h-4 w-4" />,
    Smartphone: <Smartphone className="h-4 w-4" />,
    MessageSquare: <MessageSquare className="h-4 w-4" />,
  };

  // Get the icon based on the data or use a default
  const Icon = data.icon && iconMap[data.icon] ? iconMap[data.icon] : <Bell className="h-4 w-4" />;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3 min-w-[150px] shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-red-100 rounded text-red-600">
          {Icon}
        </div>
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      
      {data.description && (
        <div className="text-xs text-gray-500 mb-2">{data.description}</div>
      )}
      
      {/* Only output connection handle - triggers can only have outgoing connections */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="a" 
        className="w-2 h-2 bg-red-500"
      />
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(TriggerNode); 