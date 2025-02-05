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
  Radio 
} from "lucide-react"

export const iconMap = {
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
} as const

export type IconName = keyof typeof iconMap 