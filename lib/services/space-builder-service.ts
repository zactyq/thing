/**
 * Service layer for the space builder functionality
 * This layer abstracts the data fetching logic from the components
 * Currently using mock data, but structured to easily switch to API calls
 */

import type { 
  AssetType, 
  CanvasState,
  AssetTypesResponse,
  CanvasStateResponse 
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
   * @param spaceId - Identifier for the space to load
   */
  async getCanvasState(/* spaceId: string */): Promise<CanvasStateResponse> {
    // TODO: Replace with actual API call using spaceId
    // const response = await fetch(`${this.config.baseUrl}/spaces/${spaceId}/canvas`...

    // Currently returns mock data
    return { canvasState: mockCanvasState };
  }

  /**
   * Save the current canvas state
   * @param spaceId - Identifier for the space to update
   * @param state - The current canvas state to save
   */
  async saveCanvasState(spaceId: string, state: CanvasState): Promise<void> {
    // TODO: Replace with actual API call
    // await fetch(`${this.config.baseUrl}/spaces/${spaceId}/canvas`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(state)
    // });

    // Currently just logs the state
    console.log('Saving canvas state:', state);
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