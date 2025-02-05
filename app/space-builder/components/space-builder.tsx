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
import { LeftSidebar } from "./left-sidebar"
import { RightSidebar } from "./right-sidebar"
import { FloatingPalette } from "./floating-palette"
import AssetNode from "./asset-node"
import type { NodeData } from "@/lib/types/space-builder"
import { LabeledGroupNode } from "@/components/labeled-group-node"
import { SpaceBuilderService } from "@/lib/services/space-builder-service"

// Define custom node types that can be rendered in the flow
const nodeTypes: NodeTypes = {
  asset: AssetNode,  // For rendering individual assets/devices
  group: LabeledGroupNode   // For rendering grouping containers
}

// Initialize the service
const spaceBuilderService = new SpaceBuilderService()

/**
 * SpaceBuilder is a component that provides an interactive canvas for building network/space layouts.
 * It includes features like:
 * - Drag and drop nodes representing network assets (computers, printers, wifi points etc)
 * - Connection capabilities between nodes
 * - Node selection and property editing
 * - Minimap for navigation
 * - Zoom and pan controls
 * - Collapsible sidebars for node management and properties
 */
export function SpaceBuilder() {
  return (
    <ReactFlowProvider>
      <SpaceBuilderContent />
    </ReactFlowProvider>
  )
}

/**
 * SpaceBuilderContent contains the main implementation of the space builder functionality
 * Separated from the provider wrapper to maintain clean component organization
 */
function SpaceBuilderContent() {
  // State management for nodes and edges using ReactFlow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  
  // Track currently selected node for property editing
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null)
  
  // Get ReactFlow instance to access viewport
  const { screenToFlowPosition } = useReactFlow()
  
  // Control sidebar visibility states
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  // Load initial canvas state
  useEffect(() => {
    const loadCanvasState = async () => {
      try {
        const { canvasState } = await spaceBuilderService.getCanvasState() // Remove 'default' parameter
        setNodes(canvasState.nodes)
        setEdges(canvasState.edges)
      } catch (error) {
        console.error('Failed to load canvas state:', error)
      }
    }
    loadCanvasState()
  }, [setNodes, setEdges])

  // Handle new connections between nodes
  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => {
      const newEdges = addEdge(params, eds)
      // Save canvas state when connections change
      spaceBuilderService.saveCanvasState('default', { nodes, edges: newEdges })
      return newEdges
    })
  }, [nodes, setEdges])

  // Update node styling when selection changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: {
          ...node.style,
          // Add red outline for selected node
          border: node.id === selectedNode?.id ? '2px solid #ff0000' : undefined,
        },
      }))
    )
  }, [selectedNode, setNodes])

  // Handle node selection and update last selected position
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setRightSidebarOpen(true)
  }, [])

  // Clear selection when clicking on empty canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  /**
   * Add a new node to the canvas
   * Places new node at the center of the current viewport
   * @param typeId - The type identifier for the node (e.g., "router", "computer")
   * @param nodeType - Whether this is an "asset" or "group" node
   */
  const addNode = useCallback((typeId: string, nodeType: "asset" | "group") => {
    // Calculate center of the screen in flow coordinates
    const centerScreen = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    })

    const newNode: Node<NodeData> = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: centerScreen,
      draggable: true,
      selectable: true,
      deletable: true,
      // Set minimum dimensions for group nodes
      ...(nodeType === 'group' && {
        style: {
          width: 300,
          height: 200,
          minWidth: 200,  // Minimum width
          minHeight: 150  // Minimum height
        }
      }),
      data: { 
        label: nodeType === 'group' ? 'New Group' : typeId,
        typeId: typeId,
        type: nodeType,
        groupId: null
      },
      ...(nodeType === 'asset' && {
        extent: 'parent'
      })
    }
    setNodes((nds) => {
      const newNodes = nds.concat(newNode)
      // Save canvas state when nodes change
      spaceBuilderService.saveCanvasState('default', { nodes: newNodes, edges })
      return newNodes
    })

    // Automatically select the new node and open right sidebar
    setSelectedNode(newNode)
    setRightSidebarOpen(true)
  }, [edges, setNodes, screenToFlowPosition, setSelectedNode, setRightSidebarOpen])

  /**
   * Update an existing node's properties
   * @param updatedNode - Node with updated properties
   */
  const updateNode = useCallback((updatedNode: Node<NodeData>) => {
    setNodes((nds) => {
      const newNodes = nds.map((node) => {
        if (node.id === updatedNode.id) {
          // Preserve existing node properties while updating with new values
          const updatedNodeData = {
            ...node,
            // Ensure parent relationship is properly set
            parentNode: updatedNode.parentNode,
            // Maintain extent property for nested nodes
            extent: updatedNode.extent,
            // Update position if provided
            position: updatedNode.position || node.position,
            // Preserve style
            style: {
              ...node.style,
              ...updatedNode.style,
            },
            data: {
              ...node.data,
              ...updatedNode.data,
              // Ensure parent relationship is tracked in data
              parentId: updatedNode.data.parentId
            }
          }
          return updatedNodeData
        }
        return node
      })

      // Save canvas state when nodes are updated
      spaceBuilderService.saveCanvasState('default', { nodes: newNodes, edges })
      return newNodes
    })
  }, [edges, setNodes])

  /**
   * Handle changes to node grouping by managing parent-child relationships and positioning
   * 
   * This function handles the logic for adding nodes to groups or removing them from groups:
   * - Updates the parent-child relationship between nodes
   * - Manages the node's containment behavior within groups
   * - Handles position reset when grouping nodes
   * - Updates all relevant node properties to maintain consistency
   * 
   * Key operations:
   * - Sets parentNode to link nodes hierarchically
   * - Updates extent to control containment behavior
   * - Maintains groupId/parentId in node data
   * - Resets position when adding to group for proper layout
   * 
   * @param groupId - ID of the group to add node to, or "none" to remove from groups
   */
  const handleGroupChange = useCallback((groupId: string) => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        // Set parent relationship - undefined if removing from group
        parentNode: groupId === "none" ? undefined : groupId,
        // Control containment - parent extent keeps node within group bounds
        extent: groupId === "none" ? undefined : 'parent' as const,
        data: {
          ...selectedNode.data,
          // Track group membership in node data
          groupId: groupId === "none" ? null : groupId,
          // Maintain parent reference in data for consistency
          parentId: groupId === "none" ? undefined : groupId
        },
        // Reset position when adding to group for clean layout
        // Keep existing position when removing from group
        position: groupId === "none" ? selectedNode.position : {
          x: 50, // Default offset from group edge
          y: 50  // Default offset from group edge
        }
      }
      // Propagate node updates through the system
      updateNode(updatedNode)
    }
  }, [selectedNode, updateNode])

  // Save canvas state when nodes or edges change
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      spaceBuilderService.saveCanvasState('default', { nodes, edges })
    }, 1000) // Debounce saves to prevent too many requests
    return () => clearTimeout(saveTimeout)
  }, [nodes, edges])

  return (
    // Main container with full height and flex layout
    <div className="h-full flex">
      {/* Left sidebar for node management and selection */}
      <LeftSidebar 
        nodes={nodes} // Pass all nodes for tree view
        isOpen={leftSidebarOpen} // Control sidebar visibility
        onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        selectedNode={selectedNode} // Currently selected node
        onNodeSelect={(node) => {
          setSelectedNode(node) // Update selected node
          setRightSidebarOpen(true) // Open right sidebar to show properties
        }}
      />
      {/* Main canvas area that grows to fill available space */}
      <div className="flex-grow relative">
        {/* ReactFlow canvas for node/edge visualization and interaction */}
        <ReactFlow
          nodes={nodes} 
          edges={edges} // Connections between nodes
          onNodesChange={onNodesChange} // Handle node updates (position, selection etc)
          onEdgesChange={onEdgesChange} // Handle edge updates
          onConnect={onConnect} // Handle new connections between nodes
          nodeTypes={nodeTypes} // Custom node type components
          onNodeClick={onNodeClick} // Handle node selection
          onPaneClick={onPaneClick} // Handle deselection
          fitView // Automatically fit content to viewport
          snapToGrid={true} // Enable grid snapping for precise positioning
          snapGrid={[15, 15]} // Grid size for snapping
          selectNodesOnDrag={false} // Prevent node selection while dragging
          // Enable node connection features
          connectOnClick={true}
          // Style the connection line while dragging
          connectionLineStyle={{ stroke: '#999', strokeWidth: 2 }}
          // Define valid connection rules
          connectionMode={ConnectionMode.Loose}
          // Only allow connections between group nodes
          isValidConnection={(connection) => {
            const sourceNode = nodes.find(n => n.id === connection.source)
            const targetNode = nodes.find(n => n.id === connection.target)
            return (
              sourceNode?.type === 'group' && 
              targetNode?.type === 'group' &&
              // Prevent self-connections
              connection.source !== connection.target &&
              // Ensure proper handle types are connected
              connection.sourceHandle === 'child-connector' &&
              connection.targetHandle === 'parent-connector'
            )
          }}
        >
          <Controls /> {/* Zoom and pan controls */}
          <MiniMap /> {/* Overview map for navigation */}
          {/* Dotted background grid for visual reference */}
          <Background gap={12} size={3} color="#f1f1f1" variant={BackgroundVariant.Dots} />
        </ReactFlow>
        {/* Floating toolbar for adding new nodes */}
        <FloatingPalette onAddNode={addNode} />
      </div>
      <RightSidebar
        selectedNode={selectedNode}
        onUpdateNode={updateNode}
        isOpen={rightSidebarOpen}
        onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
        nodes={nodes}
        onGroupChange={handleGroupChange}
      />
    </div>
  )
}
