import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, AlertCircle, FileText, Mail, Bell, GitBranch, Smartphone, Database, Wrench, Clock } from 'lucide-react';

// Node type data definitions
const triggerNodes: NodeData[] = [
  {
    id: 'camera-trigger',
    type: 'trigger',
    label: 'Camera Trigger',
    description: 'Triggered when camera detects movement or events',
    icon: 'Camera',
    properties: {
      deviceId: '',
      eventType: 'detection',
      sensitivity: 'medium'
    }
  },
  {
    id: 'schedule-trigger',
    type: 'trigger',
    label: 'Schedule Trigger',
    description: 'Triggered at specified times or intervals',
    icon: 'Clock',
    properties: {
      schedule: 'daily',
      time: '08:00',
      daysOfWeek: ['Monday', 'Wednesday', 'Friday']
    }
  },
  {
    id: 'notification-trigger',
    type: 'trigger',
    label: 'Notification Trigger',
    description: 'Triggered when system notifications are received',
    icon: 'Bell',
    properties: {
      notificationType: 'alert',
      priority: 'high',
      sourceSystem: 'all'
    }
  },
  {
    id: 'mobile-trigger',
    type: 'trigger',
    label: 'Mobile App Trigger',
    description: 'Triggered by mobile application events',
    icon: 'Smartphone',
    properties: {
      appId: '',
      eventType: 'userAction',
      requireAuth: true
    }
  }
];

const conditionNodes: NodeData[] = [
  {
    id: 'data-condition',
    type: 'condition',
    label: 'Data Condition',
    description: 'Evaluate data against specified criteria',
    icon: 'AlertCircle',
    properties: {
      field: '',
      operator: 'equals',
      value: '',
      caseSensitive: false
    }
  },
  {
    id: 'branch-condition',
    type: 'condition',
    label: 'Branch Decision',
    description: 'Create workflow branches based on multiple criteria',
    icon: 'GitBranch',
    properties: {
      conditions: [],
      defaultPath: 'path1'
    }
  }
];

const actionNodes: NodeData[] = [
  {
    id: 'report-action',
    type: 'action',
    label: 'Generate Report',
    description: 'Create and distribute a report',
    icon: 'FileText',
    properties: {
      reportType: 'summary',
      format: 'pdf',
      distribution: []
    }
  },
  {
    id: 'email-action',
    type: 'action',
    label: 'Send Email',
    description: 'Send an email notification',
    icon: 'Mail',
    properties: {
      recipients: [],
      subject: '',
      template: 'default',
      attachments: false
    }
  },
  {
    id: 'database-action',
    type: 'action',
    label: 'Database Update',
    description: 'Update records in the database',
    icon: 'Database',
    properties: {
      operation: 'update',
      table: '',
      fields: [],
      conditions: []
    }
  },
  {
    id: 'maintenance-action',
    type: 'action',
    label: 'Maintenance Task',
    description: 'Schedule or assign a maintenance task',
    icon: 'Wrench',
    properties: {
      taskType: 'inspection',
      priority: 'medium',
      assignee: '',
      dueDate: ''
    }
  }
];

/**
 * NodeData interface defines the structure of data for workflow nodes
 * This provides type safety for node data across the application
 */
export interface NodeData {
  id?: string;
  label: string;
  description: string;
  icon: string;
  properties: Record<string, unknown>;
  type?: "trigger" | "condition" | "action";
  [key: string]: unknown;
}

// Helper function to safely convert undefined or unknown values to string
export function asString(value: unknown): string {
  return typeof value === 'string' ? value : String(value || '');
}

/**
 * NodePanelProps interface defines the properties for the NodePanel component
 */
interface NodePanelProps {
  onAddNode: (type: string, data: NodeData) => void;
}

export default function NodePanel({ onAddNode }: NodePanelProps) {
  // Helper function to render a node item in the panel
  const renderNodeItem = (node: NodeData, IconComponent: React.ReactNode) => (
    <Card 
      key={node.id} 
      className="p-3 mb-2 cursor-pointer hover:bg-gray-50"
      onClick={() => onAddNode(node.type as string, node)}
    >
      <div className="flex items-center gap-2">
        <div className="p-1 rounded">
          {IconComponent}
        </div>
        <div>
          <div className="text-sm font-medium">{node.label}</div>
          <div className="text-xs text-gray-500">{node.description}</div>
        </div>
      </div>
    </Card>
  );

  // Map icons to components
  const iconComponents = {
    Camera: <Camera className="h-4 w-4 text-red-500" />,
    Clock: <Clock className="h-4 w-4 text-red-500" />,
    Bell: <Bell className="h-4 w-4 text-red-500" />,
    Smartphone: <Smartphone className="h-4 w-4 text-red-500" />,
    AlertCircle: <AlertCircle className="h-4 w-4 text-blue-500" />,
    GitBranch: <GitBranch className="h-4 w-4 text-blue-500" />,
    FileText: <FileText className="h-4 w-4 text-slate-500" />,
    Mail: <Mail className="h-4 w-4 text-slate-500" />,
    Database: <Database className="h-4 w-4 text-slate-500" />,
    Wrench: <Wrench className="h-4 w-4 text-slate-500" />
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Triggers</h3>
        <div className="space-y-2">
          {triggerNodes.map(node => renderNodeItem(node, iconComponents[node.icon as keyof typeof iconComponents]))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Conditions</h3>
        <div className="space-y-2">
          {conditionNodes.map(node => renderNodeItem(node, iconComponents[node.icon as keyof typeof iconComponents]))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Actions</h3>
        <div className="space-y-2">
          {actionNodes.map(node => renderNodeItem(node, iconComponents[node.icon as keyof typeof iconComponents]))}
        </div>
      </div>
    </div>
  );
} 