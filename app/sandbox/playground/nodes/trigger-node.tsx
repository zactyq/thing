import { Handle, Position } from "reactflow"
import { Camera, MapPin, Clock } from "lucide-react"

interface TriggerNodeProps {
  data: {
    label: string
    description: string
    icon: string
  }
  selected: boolean
}

export default function TriggerNode({ data, selected }: TriggerNodeProps) {
  // Map icon string to component
  const IconComponent = () => {
    switch (data.icon) {
      case "Camera":
        return <Camera className="h-4 w-4" />
      case "MapPin":
        return <MapPin className="h-4 w-4" />
      case "Clock":
        return <Clock className="h-4 w-4" />
      default:
        return <Camera className="h-4 w-4" />
    }
  }

  return (
    <div className={`rounded-md border bg-card p-3 shadow-sm w-60 ${selected ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
          <IconComponent />
        </div>
        <div className="font-medium text-sm">{data.label}</div>
      </div>
      <div className="text-xs text-muted-foreground">{data.description}</div>

      {/* Output handle */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary border-2 border-background" />
    </div>
  )
}

