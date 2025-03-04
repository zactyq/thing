"use client"

import { Camera, AlertCircle, FileText, MapPin, Clock, Bell, Wifi, Thermometer, BarChart } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface NodePanelProps {
  onAddNode: (type: string, data: any) => void
}

export default function NodePanel({ onAddNode }: NodePanelProps) {
  const triggerNodes = [
    {
      type: "triggerNode",
      data: {
        label: "IoT Camera Trigger",
        description: "Triggered when camera detects an event",
        icon: "Camera",
        properties: {
          deviceId: "camera-01",
          eventType: "detection",
        },
      },
      icon: Camera,
    },
    {
      type: "triggerNode",
      data: {
        label: "GPS Location",
        description: "Triggered at specific location",
        icon: "MapPin",
        properties: {
          deviceId: "gps-01",
          radius: "100m",
        },
      },
      icon: MapPin,
    },
    {
      type: "triggerNode",
      data: {
        label: "Schedule",
        description: "Triggered at specific times",
        icon: "Clock",
        properties: {
          schedule: "daily",
          time: "08:00",
        },
      },
      icon: Clock,
    },
  ]

  const conditionNodes = [
    {
      type: "conditionNode",
      data: {
        label: "Object Detection",
        description: "Check if specific object was detected",
        icon: "AlertCircle",
        properties: {
          objectType: "pothole",
          confidence: "0.85",
        },
      },
      icon: AlertCircle,
    },
    {
      type: "conditionNode",
      data: {
        label: "Temperature Threshold",
        description: "Check if temperature exceeds threshold",
        icon: "Thermometer",
        properties: {
          threshold: "30°C",
          operator: ">",
        },
      },
      icon: Thermometer,
    },
    {
      type: "conditionNode",
      data: {
        label: "Connection Status",
        description: "Check device connection status",
        icon: "Wifi",
        properties: {
          status: "connected",
          duration: "> 5min",
        },
      },
      icon: Wifi,
    },
  ]

  const actionNodes = [
    {
      type: "actionNode",
      data: {
        label: "Generate Report",
        description: "Create a maintenance report",
        icon: "FileText",
        properties: {
          reportType: "maintenance",
          priority: "medium",
          includeLocation: true,
        },
      },
      icon: FileText,
    },
    {
      type: "actionNode",
      data: {
        label: "Send Notification",
        description: "Send alert to maintenance team",
        icon: "Bell",
        properties: {
          channel: "email",
          recipients: "maintenance-team",
          priority: "high",
        },
      },
      icon: Bell,
    },
    {
      type: "actionNode",
      data: {
        label: "Log Analytics",
        description: "Record event for analytics",
        icon: "BarChart",
        properties: {
          dataStore: "analytics-db",
          retention: "90 days",
        },
      },
      icon: BarChart,
    },
  ]

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="font-medium mb-2">Triggers</h3>
          <div className="space-y-2">
            {triggerNodes.map((node, index) => (
              <Card
                key={`trigger-${index}`}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onAddNode(node.type, node.data)}
              >
                <CardHeader className="p-3">
                  <div className="flex items-center gap-2">
                    <node.icon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">{node.data.label}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{node.data.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">Conditions</h3>
          <div className="space-y-2">
            {conditionNodes.map((node, index) => (
              <Card
                key={`condition-${index}`}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onAddNode(node.type, node.data)}
              >
                <CardHeader className="p-3">
                  <div className="flex items-center gap-2">
                    <node.icon className="h-4 w-4 text-amber-500" />
                    <CardTitle className="text-sm">{node.data.label}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{node.data.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">Actions</h3>
          <div className="space-y-2">
            {actionNodes.map((node, index) => (
              <Card
                key={`action-${index}`}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onAddNode(node.type, node.data)}
              >
                <CardHeader className="p-3">
                  <div className="flex items-center gap-2">
                    <node.icon className="h-4 w-4 text-green-500" />
                    <CardTitle className="text-sm">{node.data.label}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{node.data.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

