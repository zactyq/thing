/**
 * Service layer for the space builder functionality
 * This layer abstracts the data fetching logic from the components
 * Currently using mock data, but structured to easily switch to API calls
 */

import type { 
  AssetType, 
  AssetTypesResponse,
  CanvasState,
  CanvasStateResponse,
  ProjectMetadata,
  Place,
  Status
} from '../types/space-builder'
import { mockCanvasState } from '../data/mock/canvas-state'
import type { User, Group, Team, TeamManagementResponse } from '../types/team-management'

/**
 * Configuration for the service layer
 * This will be used to configure API endpoints and other service-specific settings
 */
interface ServiceConfig {
  baseUrl?: string;
  apiKey?: string;
}

// Storage keys used for localStorage
const STORAGE_KEYS = {
  PROJECTS_LIST: 'space_builder_projects',
  PROJECT_PREFIX: 'space_builder_project_',
  PLACES: 'space_builder_places',
  STATUSES: 'space_builder_statuses'
}

const DEFAULT_ASSET_TYPES: AssetType[] = [
  // Room Types
  {
    id: "office-room",
    name: "Office Room",
    icon: "Building",
    description: "Individual or shared office space for staff members",
    category: "Rooms",
    isActive: true
  },
  {
    id: "meeting-room",
    name: "Meeting Room",
    icon: "LayoutDashboard",
    description: "Conference or meeting space with presentation facilities",
    category: "Rooms",
    isActive: true
  },
  {
    id: "server-room",
    name: "Server Room",
    icon: "Server",
    description: "Secure space for server and network infrastructure",
    category: "Technical Spaces",
    isActive: true
  },
  
  // Access Points
  {
    id: "main-entrance",
    name: "Main Entrance",
    icon: "DoorOpen",
    description: "Primary building entrance with access control",
    category: "Access Points",
    isActive: true
  },
  {
    id: "secure-door",
    name: "Secure Door",
    icon: "DoorClosed",
    description: "Access-controlled door with security clearance required",
    category: "Access Points",
    isActive: true
  },
  
  // Network Infrastructure
  {
    id: "wifi-ap",
    name: "WiFi Access Point",
    icon: "Wifi",
    description: "Wireless network access point",
    category: "Network",
    isActive: true
  },
  {
    id: "network-cabinet",
    name: "Network Cabinet",
    icon: "Router",
    description: "Network equipment and patch panel cabinet",
    category: "Network",
    isActive: true
  },

  // Security
  {
    id: "security-camera",
    name: "Security Camera",
    icon: "Camera",
    description: "Surveillance camera with motion detection",
    category: "Security",
    isActive: true
  },

  // Monitoring
  {
    id: "environment-sensor",
    name: "Environment Sensor",
    icon: "Gauge",
    description: "Multi-purpose environmental monitoring sensor",
    category: "Sensors",
    isActive: true
  }
]

// Mock place data for the dropdown
const MOCK_PLACES = [
  {
    placeId: "place-001",
    name: "Headquarters",
    city: "San Francisco",
    state: "CA",
    organizationId: "org-001"
  },
  {
    placeId: "place-002",
    name: "Research Center",
    city: "Boston",
    state: "MA",
    organizationId: "org-001"
  },
  {
    placeId: "place-003",
    name: "Manufacturing Plant",
    city: "Detroit",
    state: "MI",
    organizationId: "org-001"
  },
  {
    placeId: "place-004",
    name: "Distribution Center",
    city: "Austin",
    state: "TX",
    organizationId: "org-001"
  },
  {
    placeId: "place-005",
    name: "Innovation Lab",
    city: "Seattle",
    state: "WA",
    organizationId: "org-001"
  }
];

// Mock status data for the dropdown
const MOCK_STATUSES = [
  {
    statusId: "status-001",
    name: "Operational",
    description: "System or asset is fully operational with no issues",
    color: "#4CAF50", // Green
    category: "Operational",
    priority: 3,
    organizationId: "org-001",
    isDefault: true,
    isActive: true
  },
  {
    statusId: "status-002",
    name: "Under Maintenance",
    description: "System or asset is currently undergoing scheduled maintenance",
    color: "#FFC107", // Amber
    category: "Operational",
    priority: 2,
    organizationId: "org-001",
    isDefault: true,
    isActive: true
  },
  {
    statusId: "status-003",
    name: "Critical Alert",
    description: "System or asset has a critical issue requiring immediate attention",
    color: "#F44336", // Red
    category: "Operational",
    priority: 1,
    organizationId: "org-001",
    isDefault: true,
    isActive: true
  },
  {
    statusId: "status-004",
    name: "Restricted Access",
    description: "Access to this area or asset is restricted to authorized personnel only",
    color: "#9C27B0", // Purple
    category: "Security",
    priority: 2,
    organizationId: "org-001",
    isDefault: true,
    isActive: true
  },
  {
    statusId: "status-005",
    name: "Offline",
    description: "System or asset is currently offline or unavailable",
    color: "#607D8B", // Blue Grey
    category: "Operational",
    priority: 2,
    organizationId: "org-001",
    isDefault: true,
    isActive: true
  }
];

// Mock team management data
const MOCK_USERS: User[] = [
  {
    userId: "user-001",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    role: "admin",
    department: "IT",
    title: "Systems Architect",
    groupIds: ["group-001", "group-002"]
  },
  {
    userId: "user-002",
    name: "Jamie Smith",
    email: "jamie.s@example.com",
    role: "manager",
    department: "Operations",
    title: "Operations Manager",
    groupIds: ["group-001"]
  },
  {
    userId: "user-003",
    name: "Taylor Brown",
    email: "taylor.b@example.com",
    role: "editor",
    department: "Engineering",
    title: "Network Engineer",
    groupIds: ["group-002"]
  },
  {
    userId: "user-004",
    name: "Sam Rivera",
    email: "sam.r@example.com",
    role: "viewer",
    department: "Support",
    title: "Support Specialist",
    groupIds: ["group-003"]
  },
  {
    userId: "user-005",
    name: "Jordan Lee",
    email: "jordan.l@example.com",
    role: "editor",
    department: "Security",
    title: "Security Analyst",
    groupIds: ["group-003"]
  }
];

const MOCK_GROUPS: Group[] = [
  {
    groupId: "group-001",
    name: "Infrastructure Team",
    description: "Responsible for core infrastructure management",
    createdBy: "user-001",
    createdAt: new Date(2023, 1, 15).toISOString(),
    memberCount: 2
  },
  {
    groupId: "group-002",
    name: "Network Team",
    description: "Handles all network-related tasks and monitoring",
    createdBy: "user-001",
    createdAt: new Date(2023, 2, 20).toISOString(),
    memberCount: 2
  },
  {
    groupId: "group-003",
    name: "Security Team",
    description: "Manages security policies and incident response",
    createdBy: "user-002",
    createdAt: new Date(2023, 3, 10).toISOString(),
    memberCount: 2
  }
];

const MOCK_TEAMS: Team[] = [
  {
    teamId: "team-001",
    name: "Core Operations",
    description: "Responsible for day-to-day operations",
    leadId: "user-002",
    groupIds: ["group-001", "group-003"]
  },
  {
    teamId: "team-002",
    name: "Technical Services",
    description: "Handles all technical implementations and support",
    leadId: "user-001",
    groupIds: ["group-002"]
  }
];

/**
 * PlacesResponse interface defines the structure of the response from places-related API calls
 */
interface PlacesResponse {
  places?: Place[];
  success?: boolean;
  message?: string;
}

/**
 * StatusesResponse interface defines the structure of the response from statuses-related API calls
 */
interface StatusesResponse {
  statuses?: Status[];
  success?: boolean;
  message?: string;
}

/**
 * Service class that handles all data operations for the space builder
 * Currently uses mock data but structured to easily switch to API calls
 * Now enhanced with local storage capabilities for project persistence
 */
export class SpaceBuilderService {
  private config: ServiceConfig;

  constructor(config: ServiceConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL,
      apiKey: config.apiKey || process.env.NEXT_PUBLIC_API_KEY
    };
  }

  /**
   * Fetch all available asset types
   * This will eventually call an API endpoint
   */
  async getAssetTypes(): Promise<AssetTypesResponse> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.config.baseUrl}/asset-types`, {
    //   headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
    // });
    // return response.json();

    // Currently returns mock data
    return { assetTypes: DEFAULT_ASSET_TYPES };
  }

  /**
   * Fetch the canvas state for a specific space
   * Now enhanced to support loading from localStorage
   * @param spaceId - Identifier for the space to load (optional)
   */
  async getCanvasState(spaceId?: string): Promise<CanvasStateResponse> {
    // If we're in a browser environment and a spaceId is provided, try to load from localStorage
    if (typeof window !== 'undefined' && spaceId) {
      const storedState = localStorage.getItem(`${STORAGE_KEYS.PROJECT_PREFIX}${spaceId}`);
      
      if (storedState) {
        try {
          const parsedState = JSON.parse(storedState);
          return { canvasState: parsedState };
        } catch (error) {
          console.error('Failed to parse stored state:', error);
        }
      }
    }

    // Fall back to mock data if no localStorage data is found or if we're not in a browser
    return { canvasState: mockCanvasState };
  }

  /**
   * Save the current canvas state
   * Now enhanced to support saving to localStorage
   * @param spaceId - Identifier for the space to update
   * @param state - The current canvas state to save
   * @param metadata - Optional metadata about the project (name, description, etc.)
   */
  async saveCanvasState(spaceId: string, state: CanvasState, metadata?: Partial<ProjectMetadata>): Promise<void> {
    // In a browser environment, save to localStorage
    if (typeof window !== 'undefined') {
      try {
        // Save the canvas state
        localStorage.setItem(`${STORAGE_KEYS.PROJECT_PREFIX}${spaceId}`, JSON.stringify(state));
        
        // Update the projects list with metadata
        const projectsList = this.getProjectsList();
        const existingProjectIndex = projectsList.findIndex(p => p.id === spaceId);
        
        const updatedMetadata: ProjectMetadata = {
          id: spaceId,
          name: metadata?.name || (existingProjectIndex >= 0 ? projectsList[existingProjectIndex].name : `Project ${spaceId}`),
          description: metadata?.description || (existingProjectIndex >= 0 ? projectsList[existingProjectIndex].description : ''),
          lastModified: new Date().toISOString(),
          createdAt: existingProjectIndex >= 0 ? projectsList[existingProjectIndex].createdAt : new Date().toISOString()
        };
        
        if (existingProjectIndex >= 0) {
          projectsList[existingProjectIndex] = updatedMetadata;
        } else {
          projectsList.push(updatedMetadata);
        }
        
        localStorage.setItem(STORAGE_KEYS.PROJECTS_LIST, JSON.stringify(projectsList));
        
        console.log('Project saved to localStorage:', spaceId);
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }
    
    // For future backend integration
    // TODO: Replace with actual API call
    // await fetch(`${this.config.baseUrl}/spaces/${spaceId}/canvas`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(state)
    // });

    console.log('Saving canvas state:', state);
  }

  /**
   * Get a list of all projects saved in localStorage
   * @returns Array of project metadata
   */
  getProjectsList(): ProjectMetadata[] {
    if (typeof window === 'undefined') {
      return [];
    }
    
    try {
      const projectsListJson = localStorage.getItem(STORAGE_KEYS.PROJECTS_LIST);
      return projectsListJson ? JSON.parse(projectsListJson) : [];
    } catch (error) {
      console.error('Failed to get projects list:', error);
      return [];
    }
  }

  /**
   * Delete a project from localStorage
   * @param projectId - The ID of the project to delete
   */
  deleteProject(projectId: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    try {
      // Remove the project data
      localStorage.removeItem(`${STORAGE_KEYS.PROJECT_PREFIX}${projectId}`);
      
      // Update the projects list
      const projectsList = this.getProjectsList();
      const updatedList = projectsList.filter(p => p.id !== projectId);
      localStorage.setItem(STORAGE_KEYS.PROJECTS_LIST, JSON.stringify(updatedList));
      
      return true;
    } catch (error) {
      console.error('Failed to delete project:', error);
      return false;
    }
  }

  /**
   * Export a project as a JSON file for the user to download
   * @param projectId - The ID of the project to export
   */
  exportProject(projectId: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    try {
      const projectData = localStorage.getItem(`${STORAGE_KEYS.PROJECT_PREFIX}${projectId}`);
      if (!projectData) {
        return false;
      }
      
      // Get metadata
      const projectsList = this.getProjectsList();
      const projectMetadata = projectsList.find(p => p.id === projectId);
      
      // Combine data and metadata
      const exportData = {
        metadata: projectMetadata,
        canvasState: JSON.parse(projectData)
      };
      
      // Create a download link
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${projectMetadata?.name || projectId}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      return true;
    } catch (error) {
      console.error('Failed to export project:', error);
      return false;
    }
  }

  /**
   * Import a project from a JSON file
   * @param file - The JSON file to import
   * @returns Promise resolving to the imported project ID
   */
  async importProject(file: File): Promise<string | null> {
    if (typeof window === 'undefined') {
      return null;
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          const projectData = JSON.parse(result);
          
          // Validate the imported data
          if (!projectData.canvasState || !projectData.metadata) {
            reject(new Error('Invalid project file format'));
            return;
          }
          
          // Generate a new ID for the imported project to avoid conflicts
          const newProjectId = `imported-${Date.now()}`;
          
          // Save the canvas state
          localStorage.setItem(`${STORAGE_KEYS.PROJECT_PREFIX}${newProjectId}`, JSON.stringify(projectData.canvasState));
          
          // Update metadata
          const projectsList = this.getProjectsList();
          const newMetadata: ProjectMetadata = {
            id: newProjectId,
            name: `${projectData.metadata.name} (Imported)`,
            description: projectData.metadata.description || '',
            lastModified: new Date().toISOString(),
            createdAt: new Date().toISOString()
          };
          
          projectsList.push(newMetadata);
          localStorage.setItem(STORAGE_KEYS.PROJECTS_LIST, JSON.stringify(projectsList));
          
          resolve(newProjectId);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Create a new asset type
   * @param assetType - The new asset type to create
   */
  async createAssetType(assetType: Omit<AssetType, 'id'>): Promise<AssetType> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.config.baseUrl}/asset-types`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(assetType)
    // });
    // return response.json();

    // Currently just returns the asset type with a mock ID
    return {
      ...assetType,
      id: `custom-${Date.now()}`
    };
  }

  /**
   * Update an existing asset type
   * @param id - ID of the asset type to update
   * @param updates - The properties to update
   */
  async updateAssetType(id: string, updates: Partial<AssetType>): Promise<AssetType> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.config.baseUrl}/asset-types/${id}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(updates)
    // });
    // return response.json();

    // Currently just logs the update
    console.log(`Updating asset type ${id}:`, updates);
    return {
      ...DEFAULT_ASSET_TYPES.find(asset => asset.id === id)!,
      ...updates
    };
  }

  /**
   * Retrieves the list of places from storage or initializes with mock data if none exists
   * In a production environment, this would make an API call to fetch places
   * 
   * @returns Promise resolving to a PlacesResponse object containing the places array
   */
  async getPlaces(): Promise<PlacesResponse> {
    // Try to get places from localStorage first
    const storedPlaces = localStorage.getItem(STORAGE_KEYS.PLACES);
    
    if (storedPlaces) {
      try {
        const places = JSON.parse(storedPlaces);
        return { places };
      } catch (error) {
        console.error('Failed to parse stored places:', error);
      }
    }
    
    // Return mock data if nothing in localStorage
    return { places: MOCK_PLACES };
  }
  
  /**
   * Saves the list of places to storage
   * In a production environment, this would make an API call to update places
   * 
   * @param places - Array of Place objects to save
   * @returns Promise resolving to a PlacesResponse object
   */
  async savePlaces(places: Place[]): Promise<PlacesResponse> {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(places));
    return { success: true };
  }

  /**
   * Get users list from localStorage or mock data
   * @returns Promise resolving to an array of user objects
   */
  async getUsers(): Promise<TeamManagementResponse> {
    // Try to get users from localStorage first
    const storedUsers = localStorage.getItem('spacebuilder_users');
    
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        return { users };
      } catch (error) {
        console.error('Failed to parse stored users:', error);
      }
    }
    
    // Return mock data if nothing in localStorage
    return { users: MOCK_USERS };
  }
  
  /**
   * Save users to localStorage
   * @param users - Array of user objects to save
   */
  async saveUsers(users: User[]): Promise<TeamManagementResponse> {
    // Save to localStorage
    localStorage.setItem('spacebuilder_users', JSON.stringify(users));
    return { success: true, users };
  }
  
  /**
   * Get groups list from localStorage or mock data
   * @returns Promise resolving to an array of group objects
   */
  async getGroups(): Promise<TeamManagementResponse> {
    // Try to get groups from localStorage first
    const storedGroups = localStorage.getItem('spacebuilder_groups');
    
    if (storedGroups) {
      try {
        const groups = JSON.parse(storedGroups);
        return { groups };
      } catch (error) {
        console.error('Failed to parse stored groups:', error);
      }
    }
    
    // Return mock data if nothing in localStorage
    return { groups: MOCK_GROUPS };
  }
  
  /**
   * Save groups to localStorage
   * @param groups - Array of group objects to save
   */
  async saveGroups(groups: Group[]): Promise<TeamManagementResponse> {
    // Save to localStorage
    localStorage.setItem('spacebuilder_groups', JSON.stringify(groups));
    return { success: true, groups };
  }
  
  /**
   * Get teams list from localStorage or mock data
   * @returns Promise resolving to an array of team objects
   */
  async getTeams(): Promise<TeamManagementResponse> {
    // Try to get teams from localStorage first
    const storedTeams = localStorage.getItem('spacebuilder_teams');
    
    if (storedTeams) {
      try {
        const teams = JSON.parse(storedTeams);
        return { teams };
      } catch (error) {
        console.error('Failed to parse stored teams:', error);
      }
    }
    
    // Return mock data if nothing in localStorage
    return { teams: MOCK_TEAMS };
  }
  
  /**
   * Save teams to localStorage
   * @param teams - Array of team objects to save
   */
  async saveTeams(teams: Team[]): Promise<TeamManagementResponse> {
    // Save to localStorage
    localStorage.setItem('spacebuilder_teams', JSON.stringify(teams));
    return { success: true, teams };
  }

  /**
   * Retrieves the list of statuses from storage or initializes with mock data if none exists
   * In a production environment, this would make an API call to fetch statuses
   * 
   * @returns Promise resolving to a StatusesResponse object containing the statuses array
   */
  async getStatuses(): Promise<StatusesResponse> {
    try {
      // Check if we have statuses in localStorage
      const storedStatuses = localStorage.getItem(STORAGE_KEYS.STATUSES);
      
      if (storedStatuses) {
        // If we have stored statuses, parse and return them
        const statuses = JSON.parse(storedStatuses) as Status[];
        return { statuses, success: true };
      } else {
        // If no stored statuses, initialize with mock data
        localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(MOCK_STATUSES));
        return { statuses: MOCK_STATUSES, success: true };
      }
    } catch (error) {
      console.error('Error retrieving statuses:', error);
      return { 
        success: false, 
        message: 'Failed to retrieve statuses. Please try again.' 
      };
    }
  }

  /**
   * Saves the list of statuses to storage
   * In a production environment, this would make an API call to update statuses
   * 
   * @param statuses - Array of Status objects to save
   * @returns Promise resolving to a StatusesResponse object
   */
  async saveStatuses(statuses: Status[]): Promise<StatusesResponse> {
    try {
      // Save statuses to localStorage
      localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(statuses));
      
      return { 
        statuses, 
        success: true,
        message: 'Statuses saved successfully.'
      };
    } catch (error) {
      console.error('Error saving statuses:', error);
      return { 
        success: false, 
        message: 'Failed to save statuses. Please try again.' 
      };
    }
  }
} 