import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

// Available function types that can be added to nodes
const AVAILABLE_FUNCTIONS = [
  { id: 'aws-mqtt', name: 'AWS MQTT' },
  { id: 'mqtt', name: 'MQTT' },
  { id: 'refera-nig', name: 'Refera NIG' },
  { id: 'tuya', name: 'Tuya' }
] as const

// Type for the function configuration
export interface FunctionConfig {
  type: typeof AVAILABLE_FUNCTIONS[number]['id']
  pairingId: string
}

interface AddFunctionModalProps {
  /**
   * Whether the modal is currently visible
   */
  isOpen: boolean
  /**
   * Callback when the modal should be closed
   */
  onClose: () => void
  /**
   * Callback when a function is successfully configured
   * @param config The function configuration
   */
  onSave: (config: FunctionConfig) => void
}

/**
 * Modal component for adding and configuring functions to nodes
 * 
 * Features:
 * - Function type selection from predefined options
 * - Pairing ID configuration
 * - Save/Cancel functionality
 */
export function AddFunctionModal({ isOpen, onClose, onSave }: AddFunctionModalProps) {
  // State for the selected function type and pairing ID
  const [selectedFunction, setSelectedFunction] = useState<typeof AVAILABLE_FUNCTIONS[number]['id'] | ''>('')
  const [pairingId, setPairingId] = useState('')

  // Handle saving the function configuration
  const handleSave = () => {
    if (selectedFunction && pairingId) {
      onSave({
        type: selectedFunction,
        pairingId
      })
      // Reset form state
      setSelectedFunction('')
      setPairingId('')
      onClose()
    }
  }

  // Handle modal close and reset form
  const handleClose = () => {
    setSelectedFunction('')
    setPairingId('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Function</DialogTitle>
          <DialogDescription>
            Configure a new function by selecting its type and setting up the pairing ID.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="function-type">Function Type</Label>
            <Select
              value={selectedFunction}
              onValueChange={(value: typeof AVAILABLE_FUNCTIONS[number]['id'] | '') => setSelectedFunction(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select function type" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_FUNCTIONS.map((func) => (
                  <SelectItem key={func.id} value={func.id}>
                    {func.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pairing-id">Pairing ID</Label>
            <Input
              id="pairing-id"
              value={pairingId}
              onChange={(e) => setPairingId(e.target.value)}
              placeholder="Enter pairing ID"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedFunction || !pairingId}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 