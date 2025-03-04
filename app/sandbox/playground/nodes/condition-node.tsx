import { Handle, Position } from "reactflow"
import { AlertCircle, Thermometer, Wifi } from "lucide-react"

interface ConditionNodeProps {
  data: {
    label: string
    description: string
    icon: string
  }
  selected: boolean
}

export default function ConditionNode({ data, selected }: ConditionNodeProps) {
  // Map icon string to component
  const IconComponent = () => {
    switch (data.icon) {
      case "AlertCircle":
        return <AlertCircle className="h-4 w-4" />
      case "Thermometer":
        return <Thermometer className="h-4 w-4" />
      case "Wifi":
        return <Wifi className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className={`rounded-md border bg-card p-3 shadow-sm w-60 ${selected ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500">
          <IconComponent />
        </div>
        <div className="font-medium text-sm">{data.label}</div>
      </div>
      <div className="text-xs text-muted-foreground">{data.description}</div>

      {/* Input handle */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-amber-500 border-2 border-background" />

      {/* Output handle */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-amber-500 border-2 border-background" />
    </div>
  )
}

