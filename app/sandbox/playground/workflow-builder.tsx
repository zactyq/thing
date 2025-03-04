"use client"

import type React from "react"

import { useCallback, useState } from "react"
import ReactFlow, {
  addEdge,
  Background,
  type Connection,
  Controls,
  type Edge,
  type Node,
  type NodeTypes,
  useEdgesState,
  useNodesState,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TriggerNode from "@/components/nodes/trigger-node"
import ConditionNode from "@/components/nodes/condition-node"
import ActionNode from "@/components/nodes/action-node"
import NodePanel from "@/components/node-panel"

// Define custom node types
const nodeTypes: NodeTypes = {
  triggerNode: TriggerNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
}

// Initial nodes for demonstration
const initialNodes: Node[] = [
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
    },
  },
]

// Initial edges connecting the nodes
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
]

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // Handle connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
    },
    [setEdges],
  )

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  // Handle node deselection
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Add a new node to the workflow
  const addNode = useCallback(
    (type: string, data: any) => {
      const newNode: Node = {
        id: `${nodes.length + 1}`,
        type,
        position: { x: 250, y: nodes.length * 150 + 100 },
        data,
      }
      setNodes((nds) => [...nds, newNode])
    },
    [nodes, setNodes],
  )

  // Save the workflow
  const saveWorkflow = useCallback(() => {
    const workflow = { nodes, edges }
    console.log("Saving workflow:", workflow)
    // In a real app, you would save this to a database or file
    alert("Workflow saved successfully!")
  }, [nodes, edges])

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <Tabs defaultValue="nodes" className="w-80 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>
        <TabsContent value="nodes" className="flex-1 overflow-auto">
          <NodePanel onAddNode={addNode} />
        </TabsContent>
        <TabsContent value="properties" className="flex-1 overflow-auto">
          {selectedNode ? (
            <Card className="p-4">
              <h3 className="font-medium mb-2">{selectedNode.data.label}</h3>
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
            <div className="p-4 text-center text-muted-foreground">Select a node to view its properties</div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex-1 border rounded-md overflow-hidden flex flex-col">
        <div className="p-2 border-b flex justify-between items-center bg-muted/50">
          <h2 className="text-sm font-medium">Workflow Canvas</h2>
          <Button size="sm" onClick={saveWorkflow}>
            Save Workflow
          </Button>
        </div>
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
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

