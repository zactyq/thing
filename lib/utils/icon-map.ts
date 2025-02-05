/**
 * Centralized icon mapping for the application
 * This ensures consistent icon usage across components and provides type safety
 */

import {
  Monitor,
  Printer,
  Router,
  Server,
  Wifi,
  DoorClosed,
  DoorOpen,
  Lightbulb,
  Fan,
  Thermometer,
  LayoutDashboard,
  Users,
  Projector,
  Camera,
  Radio,
  type LucideIcon
} from "lucide-react"

// Type-safe icon mapping
const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Printer,
  Router,
  Server,
  Wifi,
  DoorClosed,
  DoorOpen,
  Lightbulb,
  Fan,
  Thermometer,
  LayoutDashboard,
  Users,
  Projector,
  Camera,
  Radio
}

export { iconMap }
export type IconName = keyof typeof iconMap 