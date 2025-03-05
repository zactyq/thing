import { Handle, Position } from "reactflow"
import { FileText, Bell, BarChart } from "lucide-react"

interface ActionNodeProps {
  data: {
    label: string
    description: string
    icon: string
  }
  selected: boolean
}

export default function ActionNode({ data, selected }: ActionNodeProps) {
  // Map icon string to component
  const IconComponent = () => {
    switch (data.icon) {
      case "FileText":
        return <FileText className="h-4 w-4" />
      case "Bell":
        return <Bell className="h-4 w-4" />
      case "BarChart":
        return <BarChart className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className={`rounded-md border bg-card p-3 shadow-sm w-60 ${selected ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-500">
          <IconComponent />
        </div>
        <div className="font-medium text-sm">{data.label}</div>
      </div>
      <div className="text-xs text-muted-foreground">{data.description}</div>

      {/* Input handle */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-green-500 border-2 border-background" />
    </div>
  )
}

