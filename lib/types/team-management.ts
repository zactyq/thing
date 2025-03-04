/**
 * This file contains all type definitions for the team management functionality.
 * These types define the structure of users, groups, and teams within the system.
 */

/**
 * Represents a user in the system
 * Contains personal information and system access details
 */
export interface User {
  userId: string;       // Unique identifier for the user
  name: string;         // Full name of the user
  email: string;        // Email address (also used for login)
  role: UserRole;       // Role within the system (determines permissions)
  department?: string;  // Department or business unit
  avatar?: string;      // URL to avatar image
  title?: string;       // Job title
  groupIds: string[];   // Groups this user belongs to
}

/**
 * Possible user roles within the system
 * Each role has different permissions and access levels
 */
export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

/**
 * Represents a group of users within the system
 * Groups can be used for organizing users and assigning permissions
 */
export interface Group {
  groupId: string;      // Unique identifier for the group
  name: string;         // Display name for the group
  description: string;  // Description of the group's purpose
  createdBy: string;    // User ID of group creator
  createdAt: string;    // ISO date string of when group was created
  memberCount?: number; // Count of members in the group (can be computed)
}

/**
 * Represents a team within the organization
 * Teams are high-level organizational units that can contain multiple groups
 */
export interface Team {
  teamId: string;       // Unique identifier for the team
  name: string;         // Display name for the team
  description: string;  // Description of the team's purpose
  leadId?: string;      // User ID of the team lead
  groupIds: string[];   // Groups that belong to this team
}

/**
 * Response type for team-related API requests
 */
export interface TeamManagementResponse {
  users?: User[];
  groups?: Group[];
  teams?: Team[];
  success?: boolean;
  message?: string;
} 