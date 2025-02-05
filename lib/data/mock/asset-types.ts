/**
 * Mock data for asset types
 * This simulates what would normally come from an API endpoint
 * Each asset type represents a different kind of equipment or resource
 * that can be placed in the space builder
 */

import type { AssetType } from '../../types/space-builder'

export const mockAssetTypes: AssetType[] = [
  {
    id: "door",
    name: "Door",
    icon: "DoorClosed" as const,
    description: "Access controlled door",
    category: "Access Points",
    isActive: true
  },
  {
    id: "emergency-exit",
    name: "Emergency Exit",
    icon: "DoorOpen" as const,
    description: "Emergency exit door with alarm",
    category: "Access Points",
    isActive: true
  },
  {
    id: "light",
    name: "Light",
    icon: "Lightbulb" as const,
    description: "Controllable lighting fixture",
    category: "Lighting",
    isActive: true
  },
  {
    id: "aircon",
    name: "Air Conditioning",
    icon: "Fan" as const,
    description: "Climate control unit",
    category: "Climate",
    isActive: true
  },
  {
    id: "thermostat",
    name: "Thermostat",
    icon: "Thermometer" as const,
    description: "Temperature control device",
    category: "Climate",
    isActive: true
  },
  {
    id: "desk",
    name: "Bookable Desk",
    icon: "LayoutDashboard" as const,
    description: "Reservable workspace",
    category: "Furniture",
    isActive: true
  },
  {
    id: "meeting-room",
    name: "Meeting Room",
    icon: "Users" as const,
    description: "Bookable meeting space",
    category: "Rooms",
    isActive: true
  },
  {
    id: "projector",
    name: "Projector",
    icon: "Projector" as const,
    description: "Display equipment",
    category: "Equipment",
    isActive: true
  },
  {
    id: "camera",
    name: "Security Camera",
    icon: "Camera" as const,
    description: "Surveillance camera",
    category: "Security",
    isActive: true
  },
  {
    id: "sensor",
    name: "Motion Sensor",
    icon: "Radio" as const,
    description: "Movement detection sensor",
    category: "Sensors",
    isActive: true
  }
]

// Default asset types commonly used in most spaces
export const defaultAssetTypes: AssetType[] = [
  {
    id: "workstation",
    name: "Workstation",
    icon: "Monitor" as const,
    category: "Endpoints",
    description: "Standard workstation computer",
    isActive: true,
  },
  {
    id: "printer",
    name: "Network Printer",
    icon: "Printer" as const,
    category: "Peripherals",
    description: "Networked printing device",
    isActive: true,
  },
  {
    id: "router",
    name: "Router",
    icon: "Router" as const,
    category: "Network",
    description: "Network routing device",
    isActive: true,
  },
  {
    id: "server",
    name: "Server",
    icon: "Server" as const,
    category: "Infrastructure",
    description: "Server machine",
    isActive: true,
  },
  {
    id: "wifi",
    name: "WiFi Access Point",
    icon: "Wifi" as const,
    category: "Network",
    description: "Wireless access point",
    isActive: true,
  }
] 