/**
 * Mock data for the space builder canvas state
 * This simulates what would normally come from an API endpoint
 * Represents a sample layout of a space with various assets and their connections
 */

import type { CanvasState } from '../../types/space-builder'

export const mockCanvasState: CanvasState = {
  nodes: [
    {
      id: "office-area",
      type: "group",
      position: { x: 100, y: 100 },
      style: {
        width: 400,
        height: 300,
        padding: 20,
        backgroundColor: "rgba(240, 240, 240, 0.5)"
      },
      data: {
        label: "Main Office",
        type: "group",
        groupId: null
      }
    },
    {
      id: "meeting-area",
      type: "group",
      position: { x: 600, y: 100 },
      style: {
        width: 300,
        height: 200,
        padding: 20,
        backgroundColor: "rgba(240, 240, 240, 0.5)"
      },
      data: {
        label: "Meeting Area",
        type: "group",
        groupId: null
      }
    },
    {
      id: "main-door",
      type: "asset",
      position: { x: 50, y: 50 },
      parentNode: "office-area",
      extent: "parent",
      data: {
        label: "Main Entrance",
        typeId: "door",
        groupId: "office-area",
        type: "asset"
      }
    },
    {
      id: "desk-1",
      type: "asset",
      position: { x: 200, y: 50 },
      parentNode: "office-area",
      extent: "parent",
      data: {
        label: "Hot Desk 1",
        typeId: "desk",
        groupId: "office-area",
        type: "asset"
      }
    },
    {
      id: "meeting-room-1",
      type: "asset",
      position: { x: 50, y: 50 },
      parentNode: "meeting-area",
      extent: "parent",
      data: {
        label: "Conference Room",
        typeId: "meeting-room",
        groupId: "meeting-area",
        type: "asset"
      }
    },
    {
      id: "projector-1",
      type: "asset",
      position: { x: 150, y: 50 },
      parentNode: "meeting-area",
      extent: "parent",
      data: {
        label: "Main Projector",
        typeId: "projector",
        groupId: "meeting-area",
        type: "asset"
      }
    },
    {
      id: "sensor-1",
      type: "asset",
      position: { x: 400, y: 500 },
      data: {
        label: "Motion Sensor",
        typeId: "sensor",
        groupId: null,
        type: "asset"
      }
    }
  ],
  edges: [
    {
      id: "e1-2",
      source: "main-door",
      target: "desk-1"
    },
    {
      id: "e2-3",
      source: "desk-1",
      target: "meeting-room-1"
    },
    {
      id: "e3-4",
      source: "meeting-room-1",
      target: "projector-1"
    },
    {
      id: "e4-5",
      source: "meeting-room-1",
      target: "sensor-1"
    }
  ]
} 