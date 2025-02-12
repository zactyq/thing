/**
 * This file contains all type definitions for the space builder functionality.
 * These types are used across the application to ensure consistency between
 * the frontend components, data layer, and (future) API integration.
 */

import type { Node, Edge } from 'reactflow'
import type { IconName } from '../utils/icon-map'
import type { FunctionConfig } from "@/app/space-builder/components/add-function-modal"

/**
 * Represents a category of asset that can be placed in the space builder
 * Examples include workstations, printers, network equipment, etc.
 */
export interface AssetType {
  id: string;              // Unique identifier for the asset type
  name: string;            // Display name for the asset type
  icon: IconName;          // Icon identifier from our icon map
  description: string;     // Detailed description of what this asset type represents
  category: string;        // Grouping category (e.g., "Network Equipment", "End Devices")
  isActive: boolean;       // Whether this asset type is currently available for use
}

/**
 * Data structure for nodes in the space builder canvas
 * This extends the base node data with our specific properties
 */
export interface NodeData {
  label: string;           // Display label for the node
  typeId?: string;         // Reference to the asset type
  groupId: string | null;  // ID of the parent group, if any
  type?: "asset" | "group"; // Discriminator for node type
  parentId?: string;       // ID of the parent node (for hierarchical relationships)
  functions?: FunctionConfig[]  // Array of configured functions for this node
}

/**
 * Complete canvas state including all nodes and their connections
 * This represents the entire topology of a space
 */
export interface CanvasState {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

/**
 * Service response types for API integration
 * These types define the expected shape of API responses
 */
export interface AssetTypesResponse {
  assetTypes: AssetType[];
}

export interface CanvasStateResponse {
  canvasState: CanvasState;
} 
