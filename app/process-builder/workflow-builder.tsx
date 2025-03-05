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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Save, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Settings, 
  Undo, 
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Pencil
} from "lucide-react"

// Import node components
import TriggerNode from "@/components/nodes/trigger-node"
import ConditionNode from "@/components/nodes/condition-node"
import ActionNode from "@/components/nodes/action-node"
import NodePanel from "@/app/process-builder/components/node-panel"
import { NodeData } from "./types"

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
const initialNodes: Node<NodeData>[] = [
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
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  // Track the currently selected node for property display and editing
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null)
  
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
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<NodeData>) => {
    setSelectedNode(node)
  }, [])

  // Handle node deselection when user clicks on the canvas background
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Add a new node to the workflow with the specified type and data
  const addNode = useCallback(
    (type: string, data: NodeData) => {
      // Generate a unique ID for the new node
      const newNode: Node<NodeData> = {
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

  // Fit the view to show all nodes
  const fitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2 })
  }, [reactFlowInstance])

  return (
    <div className="h-full flex">
      {/* Left sidebar with tabs for nodes and properties */}
      <div className="w-80 border-r border-border bg-card">
        <Tabs defaultValue="nodes" className="h-full flex flex-col">
          <div className="border-b border-border p-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nodes">Nodes</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Node palette tab content */}
          <TabsContent value="nodes" className="flex-1 overflow-hidden p-0 m-0">
            <NodePanel onAddNode={addNode} />
          </TabsContent>
          
          {/* Properties panel tab content */}
          <TabsContent value="properties" className="flex-1 overflow-hidden p-0 m-0">
            <ScrollArea className="h-full">
              {selectedNode ? (
                <div className="p-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{selectedNode.data.label}</CardTitle>
                          <CardDescription>{selectedNode.data.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className={
                          selectedNode.data.type === 'trigger' ? 'bg-red-50 text-red-600' :
                          selectedNode.data.type === 'condition' ? 'bg-amber-50 text-amber-600' :
                          'bg-green-50 text-green-600'
                        }>
                          {selectedNode.data.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <h4 className="text-sm font-medium mb-2">Properties</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedNode.data.properties || {}).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                            <span className="font-medium">{key}:</span>
                            <span className="text-muted-foreground">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Properties
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="mb-2 rounded-full bg-background p-3 inline-block">
                    <Settings className="h-6 w-6" />
                  </div>
                  <p>Select a node to view and edit its properties</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Main workflow canvas */}
      <div className="flex-1 flex flex-col h-full">
        {/* Toolbar */}
        <div className="border-b border-border p-2 flex justify-between items-center bg-card">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={saveWorkflow}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save Workflow</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Separator orientation="vertical" className="h-6" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" disabled>
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo (Coming Soon)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" disabled>
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo (Coming Soon)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Separator orientation="vertical" className="h-6" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={fitView}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Fit View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div>
            <h2 className="text-sm font-medium">Process Workflow Builder</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="default" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        
        {/* ReactFlow canvas */}
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls />
            <MiniMap 
              nodeStrokeWidth={3}
              zoomable 
              pannable
              className="bg-background border border-border rounded-md"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
} 