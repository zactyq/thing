/**
 * This file contains all type definitions for the space builder functionality.
 * These types are used across the application to ensure consistency between
 * the frontend components, data layer, and (future) API integration.
 */

import type { Node, Edge } from 'reactflow'
import type { IconName } from '../utils/icon-map'
import type { FunctionConfig } from "@/app/space-builder/components/add-function-modal"

/**
 * Represents a physical location or place in the system
 * Corresponds to the 'places' table in the database
 */
export interface Place {
  placeId: string;          // Unique identifier for the place
  name: string;             // Name of the place
  description?: string;     // Detailed description of the place
  city?: string;            // City where the place is located
  state?: string;           // State/province where the place is located
  organizationId?: string;  // ID of the organization that owns this place
  geolocation?: string;     // Geographic coordinates
  streetAddress?: string;   // Street address
  postalCode?: string;      // Postal/ZIP code
  address?: string;         // Full address (alternative to separate fields)
  coordinates?: {           // Precise coordinates for mapping
    lat: number;
    lng: number;
  };
  type?: string;            // Type of place (e.g., office, warehouse)
  tags?: string[];          // Tags for categorization
  [key: string]: unknown;   // Index signature for additional properties
}

/**
 * Represents a status that can be assigned to assets or spaces in the system
 * Corresponds to the 'statuses' table in the database
 * 
 * Statuses can represent operational states (e.g., "Operational", "Maintenance"),
 * security levels (e.g., "Secure", "Restricted"), or any other categorical state
 * that needs to be tracked and managed within the space builder.
 */
export interface Status {
  statusId: string;         // Unique identifier for the status
  name: string;             // Display name for the status (e.g., "Operational", "Under Maintenance")
  description?: string;     // Detailed description of what this status represents
  color?: string;           // Color code for visual representation (e.g., "#00FF00" for green)
  icon?: IconName;          // Icon identifier from our icon map
  category?: string;        // Grouping category (e.g., "Operational", "Security", "Availability")
  priority?: number;        // Numeric priority level (lower numbers = higher priority)
  organizationId?: string;  // ID of the organization that owns this status
  isDefault?: boolean;      // Whether this is a default status option
  isActive?: boolean;       // Whether this status is currently available for use
  tags?: string[];          // Tags for categorization and filtering
  [key: string]: unknown;   // Index signature for additional properties
}

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
 * Metadata for projects saved in localStorage or exported/imported
 * Contains information about the project but not the actual canvas state
 */
export interface ProjectMetadata {
  id: string;              // Unique identifier for the project
  name: string;            // Display name for the project
  description: string;     // Optional description of the project
  createdAt: string;       // ISO date string of when the project was created
  lastModified: string;    // ISO date string of when the project was last modified
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
