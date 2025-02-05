/**
 * Centralized icon mapping for the application
 * This ensures consistent icon usage across components and provides type safety
 * 
 * Icons are specifically chosen for access control and room management functionality:
 * - Building: Represents office rooms and general spaces
 * - LayoutDashboard: Represents meeting rooms and conference spaces
 * - Server: Represents server rooms and IT infrastructure
 * - DoorClosed: Represents secure access-controlled doors
 * - DoorOpen: Represents main entrances and emergency exits
 * - Gauge: Represents environmental monitoring systems
 * - Radio: Represents various types of sensors
 * - KeyRound: Represents security access panels
 * - Camera: Represents security cameras
 * - Wifi: Represents network access points
 * - Router: Represents network infrastructure
 */

import {
  Building,
  LayoutDashboard,
  Server,
  DoorClosed,
  DoorOpen,
  Gauge,
  Radio,
  KeyRound,
  Camera,
  Wifi,
  Router,
  type LucideIcon
} from "lucide-react"

// Type-safe icon mapping for access control and room management components
const iconMap: Record<string, LucideIcon> = {
  Building,
  LayoutDashboard,
  Server,
  DoorClosed,
  DoorOpen,
  Gauge,
  Radio,
  KeyRound,
  Camera,
  Wifi,
  Router
}

export { iconMap }
export type IconName = keyof typeof iconMap 