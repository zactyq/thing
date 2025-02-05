/**
 * Mock data for the space builder canvas state
 * This simulates what would normally come from an API endpoint
 * Represents a sample office floor layout with rooms, access points, and monitoring systems
 */

import type { CanvasState } from '../../types/space-builder'

export const mockCanvasState: CanvasState = {
  nodes: [
    // Building Group - Top level container
    {
      id: "building",
      type: "group",
      position: { x: 100, y: 50 },
      style: {
        width: 1400,
        height: 900
      },
      data: {
        label: "Main Building",
        type: "group",
        groupId: null
      }
    },

    // Office Wing - Left side
    {
      id: "office-wing",
      type: "group",
      position: { x: 80, y: 150 },
      parentNode: "building",
      extent: "parent",
      style: {
        width: 600,
        height: 700
      },
      data: {
        label: "Office Wing",
        type: "group",
        groupId: "building"
      }
    },

    // Meeting Area - Inside Office Wing
    {
      id: "meeting-area",
      type: "group",
      position: { x: 50, y: 50 },
      parentNode: "office-wing",
      extent: "parent",
      style: {
        width: 500,
        height: 250
      },
      data: {
        label: "Meeting Area",
        type: "group",
        groupId: "office-wing"
      }
    },

    // Technical Wing - Right side
    {
      id: "tech-wing",
      type: "group",
      position: { x: 720, y: 150 },
      parentNode: "building",
      extent: "parent",
      style: {
        width: 600,
        height: 700
      },
      data: {
        label: "Technical Wing",
        type: "group",
        groupId: "building"
      }
    },

    // Server Room - Inside Technical Wing
    {
      id: "server-room",
      type: "group",
      position: { x: 50, y: 50 },
      parentNode: "tech-wing",
      extent: "parent",
      style: {
        width: 500,
        height: 250
      },
      data: {
        label: "Server Room",
        type: "group",
        groupId: "tech-wing"
      }
    },

    // Meeting Room Assets
    {
      id: "meeting-room-1",
      type: "asset",
      position: { x: 100, y: 100 },
      parentNode: "meeting-area",
      extent: "parent",
      data: {
        label: "Conference Room A",
        typeId: "meeting-room",
        groupId: "meeting-area",
        type: "asset"
      }
    },
    {
      id: "meeting-room-2",
      type: "asset",
      position: { x: 300, y: 100 },
      parentNode: "meeting-area",
      extent: "parent",
      data: {
        label: "Conference Room B",
        typeId: "meeting-room",
        groupId: "meeting-area",
        type: "asset"
      }
    },

    // Office Wing Assets
    {
      id: "office-room-1",
      type: "asset",
      position: { x: 100, y: 350 },
      parentNode: "office-wing",
      extent: "parent",
      data: {
        label: "Executive Office",
        typeId: "office-room",
        groupId: "office-wing",
        type: "asset"
      }
    },
    {
      id: "office-room-2",
      type: "asset",
      position: { x: 300, y: 350 },
      parentNode: "office-wing",
      extent: "parent",
      data: {
        label: "General Office",
        typeId: "office-room",
        groupId: "office-wing",
        type: "asset"
      }
    },
    {
      id: "main-entrance",
      type: "asset",
      position: { x: 100, y: 550 },
      parentNode: "office-wing",
      extent: "parent",
      data: {
        label: "Main Entrance",
        typeId: "main-entrance",
        groupId: "office-wing",
        type: "asset"
      }
    },

    // Server Room Assets
    {
      id: "server-1",
      type: "asset",
      position: { x: 100, y: 100 },
      parentNode: "server-room",
      extent: "parent",
      data: {
        label: "Primary Server",
        typeId: "server-room",
        groupId: "server-room",
        type: "asset"
      }
    },
    {
      id: "network-cabinet",
      type: "asset",
      position: { x: 300, y: 100 },
      parentNode: "server-room",
      extent: "parent",
      data: {
        label: "Network Cabinet",
        typeId: "network-cabinet",
        groupId: "server-room",
        type: "asset"
      }
    },

    // Technical Wing Assets
    {
      id: "secure-door",
      type: "asset",
      position: { x: 100, y: 350 },
      parentNode: "tech-wing",
      extent: "parent",
      data: {
        label: "Secure Access",
        typeId: "secure-door",
        groupId: "tech-wing",
        type: "asset"
      }
    },
    {
      id: "environment-sensor",
      type: "asset",
      position: { x: 300, y: 350 },
      parentNode: "tech-wing",
      extent: "parent",
      data: {
        label: "Environment Monitor",
        typeId: "environment-sensor",
        groupId: "tech-wing",
        type: "asset"
      }
    },

    // Building-wide Systems
    {
      id: "wifi-main",
      type: "asset",
      position: { x: 500, y: 60 },
      parentNode: "building",
      extent: "parent",
      data: {
        label: "Main WiFi AP",
        typeId: "wifi-ap",
        groupId: "building",
        type: "asset"
      }
    },
    {
      id: "security-camera",
      type: "asset",
      position: { x: 800, y: 60 },
      parentNode: "building",
      extent: "parent",
      data: {
        label: "Security Camera",
        typeId: "security-camera",
        groupId: "building",
        type: "asset"
      }
    }
  ],
  edges: []  // Removed edges since we no longer have connection handles
} 