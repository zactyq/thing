/**
 * NodeData interface defines the structure of data for workflow nodes
 * This provides type safety for node data across the application
 */
export interface NodeData {
  id?: string;
  label: string;           // Display name for the node
  description: string;     // Brief explanation of the node's purpose
  icon: string;            // Icon identifier to visually represent the node type
  properties: Record<string, unknown>; // Node-specific configuration properties
  type: "trigger" | "condition" | "action"; // The functional role of this node in a workflow
  [key: string]: unknown;  // Allow for additional properties
}

/**
 * Helper function to safely convert unknown values to string
 * Ensures consistent string representation of various data types
 * 
 * @param value - The value to convert to string
 * @returns A string representation of the value
 */
export function asString(value: unknown): string {
  return typeof value === 'string' ? value : String(value || '');
} 