"use client"

import React from "react"
import { Camera, AlertCircle, FileText, MapPin, Clock, Bell, Wifi, Thermometer, BarChart } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { NodeData } from "../types"

/**
 * Helper function to safely convert unknown values to string
 * Ensures consistent string representation of various data types
 * 
 * @param value - The value to convert to string
 * @returns A string representation of the value
 */
export function asString(value: unknown): string {
  return typeof value === 'string' ? value : String(value || '');
}

/**
 * NodePanelProps defines the expected props for the NodePanel component
 */
interface NodePanelProps {
  onAddNode: (type: string, data: NodeData) => void
}

/**
 * NodePanel Component
 * 
 * Provides a categorized palette of node types that can be added to the workflow.
 * Nodes are organized by their functional role (triggers, conditions, actions)
 * and can be dragged or clicked to add to the workflow canvas.
 * 
 * This component uses shadcn/ui components for consistent styling and accessibility.
 * 
 * @param onAddNode - Callback function invoked when a node is selected to be added
 */
export default function NodePanel({ onAddNode }: NodePanelProps) {
  // Node definitions organized by category
  const nodeCategories = [
    {
      id: "triggers",
      title: "Triggers",
      description: "Events that start a workflow",
      color: "text-red-500",
      nodes: [
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
            type: "trigger" as const
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
            type: "trigger" as const
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
            type: "trigger" as const
          },
          icon: Clock,
        },
      ]
    },
    {
      id: "conditions",
      title: "Conditions",
      description: "Decision points that control workflow paths",
      color: "text-amber-500",
      nodes: [
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
            type: "condition" as const
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
            type: "condition" as const
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
            type: "condition" as const
          },
          icon: Wifi,
        },
      ]
    },
    {
      id: "actions",
      title: "Actions",
      description: "Operations performed by the workflow",
      color: "text-green-500",
      nodes: [
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
            type: "action" as const
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
            type: "action" as const
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
            type: "action" as const
          },
          icon: BarChart,
        },
      ]
    }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <Accordion type="single" collapsible defaultValue="triggers" className="w-full">
          {nodeCategories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={category.color}>
                    {category.title}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{category.description}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {category.nodes.map((node, index) => (
                    <Card
                      key={`${category.id}-${index}`}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => onAddNode(node.type, node.data)}
                    >
                      <CardHeader className="p-3">
                        <div className="flex items-center gap-2">
                          <node.icon className={`h-4 w-4 ${category.color}`} />
                          <CardTitle className="text-sm">{node.data.label}</CardTitle>
                        </div>
                        <CardDescription className="text-xs">{node.data.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  )
}

