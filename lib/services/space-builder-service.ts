/**
 * Service layer for the space builder functionality
 * This layer abstracts the data fetching logic from the components
 * Currently using mock data, but structured to easily switch to API calls
 */

import type { 
  AssetType, 
  CanvasState,
  AssetTypesResponse,
  CanvasStateResponse,
  ProjectMetadata
} from '../types/space-builder'
import { mockCanvasState } from '../data/mock/canvas-state'

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
  PROJECT_PREFIX: 'space_builder_project_'
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
} 