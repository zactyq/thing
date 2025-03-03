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
import { ProjectManager } from "./project-manager"
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
 * - Project saving and loading via localStorage
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
  
  // Track current project ID
  const [currentProjectId, setCurrentProjectId] = useState(`default-${Date.now()}`)

  // Load initial canvas state
  useEffect(() => {
    const loadCanvasState = async () => {
      try {
        // Load the list of projects to check if any exist
        const projectsList = spaceBuilderService.getProjectsList();
        
        // If projects exist, load the most recently modified one
        if (projectsList.length > 0) {
          // Sort by last modified descending
          const sortedProjects = [...projectsList].sort(
            (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
          );
          
          const lastProject = sortedProjects[0];
          const { canvasState } = await spaceBuilderService.getCanvasState(lastProject.id);
          setNodes(canvasState.nodes);
          setEdges(canvasState.edges);
          setCurrentProjectId(lastProject.id);
          console.log(`Loaded most recent project: ${lastProject.name}`);
        } else {
          // If no projects exist, load the mock data
          const { canvasState } = await spaceBuilderService.getCanvasState();
          setNodes(canvasState.nodes);
          setEdges(canvasState.edges);
          
          // Save this as the first project
          spaceBuilderService.saveCanvasState(currentProjectId, canvasState, {
            name: "Default Project",
            description: "Automatically created project"
          });
        }
      } catch (error) {
        console.error('Failed to load canvas state:', error)
      }
    }
    loadCanvasState()
  }, [setNodes, setEdges, currentProjectId])

  // Handle new connections between nodes
  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => {
      const newEdges = addEdge(params, eds)
      // Save canvas state when connections change
      spaceBuilderService.saveCanvasState(currentProjectId, { nodes, edges: newEdges })
      return newEdges
    })
  }, [nodes, setEdges, currentProjectId])

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
    console.log("Adding node:", typeId, nodeType);
    
    // Calculate center of the screen in flow coordinates
    const centerScreen = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    })
    
    console.log("Center position:", centerScreen);

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
    
    console.log("New node:", newNode);
    
    setNodes((nds) => {
      const newNodes = nds.concat(newNode)
      // Save canvas state when nodes change
      spaceBuilderService.saveCanvasState(currentProjectId, { nodes: newNodes, edges })
      return newNodes
    })

    // Automatically select the new node and open right sidebar
    setSelectedNode(newNode)
    setRightSidebarOpen(true)
  }, [edges, setNodes, screenToFlowPosition, setSelectedNode, setRightSidebarOpen, currentProjectId])

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
      spaceBuilderService.saveCanvasState(currentProjectId, { nodes: newNodes, edges })
      return newNodes
    })
  }, [edges, setNodes, currentProjectId])

  /**
   * Load a project by ID
   * @param projectId - The ID of the project to load
   */
  const loadProject = useCallback(async (projectId: string) => {
    try {
      const { canvasState } = await spaceBuilderService.getCanvasState(projectId)
      setNodes(canvasState.nodes)
      setEdges(canvasState.edges)
      setCurrentProjectId(projectId)
      setSelectedNode(null)
    } catch (error) {
      console.error('Failed to load project:', error)
    }
  }, [setNodes, setEdges])

  /**
   * Create a new empty project
   */
  const createNewProject = useCallback(() => {
    const newProjectId = `project-${Date.now()}`
    setNodes([])
    setEdges([])
    setCurrentProjectId(newProjectId)
    setSelectedNode(null)
    
    // Save the empty project to create an entry
    spaceBuilderService.saveCanvasState(newProjectId, { nodes: [], edges: [] }, {
      name: "New Project",
      description: ""
    })
  }, [setNodes, setEdges])

  /**
   * Handle changes to node grouping by managing parent-child relationships and positioning
   * 
   * This function handles the logic for adding nodes to groups or removing them from groups:
   * - Updates the parent-child relationship between nodes
   * - Manages the node's containment behavior within groups
   * - Handles position reset when grouping nodes
   * - Updates all relevant node properties to maintain consistency
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
          x: 50,
          y: 50
        }
      }
      updateNode(updatedNode)
    }
  }, [selectedNode, updateNode])

  // Auto-save changes on a timer
  useEffect(() => {
    // Skip immediate save on first render
    if (nodes.length === 0 && edges.length === 0) return;
    
    const saveTimeout = setTimeout(() => {
      spaceBuilderService.saveCanvasState(currentProjectId, { nodes, edges })
    }, 2000) // Debounce saves to reduce frequency
    
    return () => clearTimeout(saveTimeout)
  }, [nodes, edges, currentProjectId])

  return (
    <div className="flex h-full">
      {/* Left sidebar */}
      <LeftSidebar 
        nodes={nodes}
        isOpen={leftSidebarOpen} 
        onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)} 
        selectedNode={selectedNode}
        onNodeSelect={(node) => {
          setSelectedNode(node)
          setRightSidebarOpen(true)
        }}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Project management toolbar */}
        <div className="border-b p-2 flex justify-center">
          <ProjectManager 
            currentProjectId={currentProjectId}
            canvasState={{ nodes, edges }}
            onLoadProject={loadProject}
            onNewProject={createNewProject}
          />
        </div>
        
        {/* ReactFlow canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            connectionMode={ConnectionMode.Loose}
            fitView
            snapToGrid
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
          
          {/* Floating palette - moved outside ReactFlow to prevent event capture issues */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <FloatingPalette onAddNode={addNode} />
          </div>
        </div>
      </div>
      
      {/* Right sidebar */}
      <RightSidebar 
        isOpen={rightSidebarOpen} 
        onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
        selectedNode={selectedNode}
        onUpdateNode={updateNode}
        nodes={nodes}
        onGroupChange={handleGroupChange}
      />
    </div>
  )
}
