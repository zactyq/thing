"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import node components
import TriggerNode from "@/components/nodes/trigger-node"
import ConditionNode from "@/components/nodes/condition-node"
import ActionNode from "@/components/nodes/action-node"
import NodePanel from "@/components/node-panel"

/**
 * WorkflowNodeData represents the data structure for workflow nodes
 * It includes properties necessary for workflow automation visualization and execution
 */
interface WorkflowNodeData {
  label: string;           // Display name for the node
  description: string;     // Brief explanation of the node's purpose
  icon: string;            // Icon identifier to visually represent the node type
  properties: Record<string, any>; // Node-specific configuration properties
  type?: "trigger" | "condition" | "action"; // The functional role of this node in a workflow
}

/**
 * Define custom node types that can be rendered in the workflow
 * Each type corresponds to a specific role in workflow automation
 */
const nodeTypes: NodeTypes = {
  triggerNode: TriggerNode, // For events that initiate a workflow
  conditionNode: ConditionNode, // For decision points and branching logic
  actionNode: ActionNode,   // For tasks and operations to be executed
}

// Initial nodes for demonstration purposes
const initialNodes: Node<WorkflowNodeData>[] = [
  {
    id: "1",
    type: "triggerNode",
    position: { x: 250, y: 100 },
    data: {
      label: "IoT Camera Trigger",
      description: "Triggered when camera detects an event",
      icon: "Camera",
      properties: {
        deviceId: "camera-01",
        eventType: "detection",
      },
      type: "trigger"
    },
  },
  {
    id: "2",
    type: "conditionNode",
    position: { x: 250, y: 250 },
    data: {
      label: "Pothole Detected",
      description: "Check if a pothole was detected",
      icon: "AlertCircle",
      properties: {
        condition: "objectType === 'pothole'",
        confidence: "0.85",
      },
      type: "condition"
    },
  },
  {
    id: "3",
    type: "actionNode",
    position: { x: 250, y: 400 },
    data: {
      label: "Generate Report",
      description: "Create a maintenance report",
      icon: "FileText",
      properties: {
        reportType: "maintenance",
        priority: "medium",
        includeLocation: true,
      },
      type: "action"
    },
  },
]

// Initial edges connecting the nodes in a directed graph
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
]

/**
 * WorkflowBuilder is a component that provides an interactive canvas for building automation workflows.
 * It includes features like:
 * - Drag and drop nodes representing triggers, conditions, and actions
 * - Connection capabilities between nodes to define workflow execution paths
 * - Node selection and property editing
 * - MiniMap for navigation
 * - Zoom and pan controls
 * - Tabbed interface for node palette and property editing
 * - Workflow saving functionality (currently just logs to console)
 *
 * This component follows a similar pattern to the SpaceBuilder but is focused on workflow automation
 * rather than physical space layouts.
 */
export default function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent />
    </ReactFlowProvider>
  )
}

/**
 * WorkflowBuilderContent contains the main implementation of the workflow builder functionality
 * It's wrapped in a ReactFlowProvider to ensure all ReactFlow hooks work properly
 */
function WorkflowBuilderContent() {
  // State management for nodes and edges using ReactFlow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  // Track the currently selected node for property display and editing
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null)
  
  // ReactFlow instance for accessing the flow API
  const reactFlowInstance = useReactFlow()

  // Handle connections between nodes when user creates a connection
  const onConnect = useCallback(
    (connection: Connection) => {
      // Add animation to all connections to visualize flow direction
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
    },
    [setEdges],
  )

  // Handle node selection when user clicks on a node
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<WorkflowNodeData>) => {
    setSelectedNode(node)
  }, [])

  // Handle node deselection when user clicks on the canvas background
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Add a new node to the workflow with the specified type and data
  const addNode = useCallback(
    (type: string, data: WorkflowNodeData) => {
      // Generate a unique ID for the new node
      const newNode: Node<WorkflowNodeData> = {
        id: `${nodes.length + 1}`,
        type,
        // Position the new node below existing nodes
        position: { 
          x: 250, 
          y: nodes.length > 0 
            ? Math.max(...nodes.map(n => n.position.y)) + 150 
            : 100 
        },
        data,
      }
      setNodes((nds) => [...nds, newNode])
    },
    [nodes, setNodes],
  )

  // Save the current workflow state
  const saveWorkflow = useCallback(() => {
    // Create a workflow object that contains all necessary data
    const workflow = { 
      nodes, 
      edges,
      metadata: {
        id: "workflow-" + Date.now(),
        name: "Workflow " + new Date().toLocaleDateString(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    }
    
    console.log("Saving workflow:", workflow)
    
    // In a real application, this would save to a backend service or localStorage
    // Similar to how SpaceBuilderService handles project persistence
    
    // For now, just show a success message
    alert("Workflow saved successfully!")
    
    // Future enhancement: Implement proper persistence using a WorkflowService
  }, [nodes, edges])

  // Load workflow state (in a real app, this would fetch from storage)
  useEffect(() => {
    // This could be extended to load saved workflows from localStorage or an API
    // Similar to how SpaceBuilderService.getCanvasState works
    console.log("Workflow builder initialized")
  }, [])

  return (
    <div className="h-full flex gap-4">
      {/* Left sidebar with tabs for nodes and properties */}
      <Tabs defaultValue="nodes" className="w-80 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>
        
        {/* Node palette tab content */}
        <TabsContent value="nodes" className="flex-1 overflow-auto">
          <NodePanel onAddNode={addNode} />
        </TabsContent>
        
        {/* Properties panel tab content */}
        <TabsContent value="properties" className="flex-1 overflow-auto">
          {selectedNode ? (
            <Card className="p-4">
              <h3 className="font-medium mb-2">{selectedNode.data.label}</h3>
              <p className="text-sm text-muted-foreground mb-4">{selectedNode.data.description}</p>
              <div className="space-y-2">
                {Object.entries(selectedNode.data.properties || {}).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-2">
                    <span className="text-sm font-medium">{key}:</span>
                    <span className="text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Select a node to view its properties
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Main workflow canvas */}
      <div className="flex-1 border rounded-md overflow-hidden flex flex-col">
        <div className="p-2 border-b flex justify-between items-center bg-muted/50">
          <h2 className="text-sm font-medium">Workflow Canvas</h2>
          <Button size="sm" onClick={saveWorkflow}>
            Save Workflow
          </Button>
        </div>
        
        {/* ReactFlow canvas area */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Strict}
            fitView
          >
            {/* Background pattern */}
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            
            {/* Interactive controls for zooming and panning */}
            <Controls />
            
            {/* MiniMap for navigation in complex workflows */}
            <MiniMap 
              nodeStrokeColor={(n) => {
                if (n.type === 'triggerNode') return '#ff0072';
                if (n.type === 'conditionNode') return '#0041d0';
                if (n.type === 'actionNode') return '#1a192b';
                return '#eee';
              }}
              nodeColor={(n) => {
                if (n.type === 'triggerNode') return '#ff6b99';
                if (n.type === 'conditionNode') return '#7196ff';
                if (n.type === 'actionNode') return '#6c6684';
                return '#fff';
              }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
} 