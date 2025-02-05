/**
 * Mock data for asset types
 * This simulates what would normally come from an API endpoint
 * Each asset type represents a different kind of equipment or resource
 * that can be placed in the space builder, specifically focused on
 * access control and room management systems
 */

import type { AssetType } from '../../types/space-builder'

export const mockAssetTypes: AssetType[] = [
  {
    id: "access-door",
    name: "Access Control Door",
    icon: "DoorClosed" as const,
    category: "Access Control",
    description: "Smart door with electronic access control system, featuring card reader integration, audit logging capabilities, and remote management. Serves as primary entry/exit point with configurable access levels.",
    isActive: true
  },
  {
    id: "emergency-exit",
    name: "Emergency Exit Door",
    icon: "DoorOpen" as const,
    category: "Safety",
    description: "Specialized exit door equipped with panic hardware, alarm integration, and automatic unlock during emergencies. Compliant with fire safety regulations and connected to building's emergency systems.",
    isActive: true
  },
  {
    id: "room-controller",
    name: "Room Control Unit",
    icon: "Gauge" as const,
    category: "Room Control",
    description: "Central control unit that manages room environment including lighting, temperature, and ventilation. Features touchscreen interface and IoT connectivity for remote management and automation.",
    isActive: true
  },
  {
    id: "presence-sensor",
    name: "Occupancy Sensor",
    icon: "Radio" as const,
    category: "Sensors",
    description: "Advanced motion and presence detection system using dual-technology sensors (PIR and ultrasonic) for accurate room occupancy monitoring. Enables automated control of room systems and security features.",
    isActive: true
  },
  {
    id: "access-panel",
    name: "Security Access Panel",
    icon: "KeyRound" as const,
    category: "Access Control",
    description: "Wall-mounted security panel for access management, featuring biometric authentication, PIN pad, and RFID card reader. Provides local control point for door access and security system configuration.",
    isActive: true
  }
] 