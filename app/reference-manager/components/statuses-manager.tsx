'use client'

import { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import { 
  Activity, 
  Plus, 
  Pencil, 
  Trash2, 
  Save,
  AlertCircle
} from 'lucide-react'
import { SpaceBuilderService } from '@/lib/services/space-builder-service'
import type { Status } from '@/lib/types/space-builder'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Initialize the service
const spaceBuilderService = new SpaceBuilderService()

/**
 * StatusesManager Component
 * 
 * A comprehensive interface for managing status data within the reference manager.
 * This component provides a full CRUD (Create, Read, Update, Delete) interface
 * for working with status data, which can be used to represent operational states,
 * security levels, or any other categorical state within the space builder.
 * 
 * Features:
 * - Tabular view of all statuses with sorting and filtering
 * - Add new statuses via modal dialog
 * - Edit existing status details including color and category
 * - Delete statuses with confirmation
 * - Real-time updates to the statuses list
 * - Visual representation of status colors
 */
export function StatusesManager() {
  // State management
  const [statuses, setStatuses] = useState<Status[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStatus, setEditingStatus] = useState<Status | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<Partial<Status>>({
    organizationId: 'org-001', // Default organization ID
    priority: 3, // Default medium priority
    isActive: true,
    isDefault: false
  })

  // Categories for statuses
  const statusCategories = [
    "Operational",
    "Security",
    "Availability",
    "Compliance",
    "Custom"
  ]

  // Load statuses on component mount
  useEffect(() => {
    const loadStatuses = async () => {
      try {
        setLoading(true)
        const { statuses } = await spaceBuilderService.getStatuses()
        if (statuses) {
          setStatuses(statuses)
        }
      } catch (error) {
        console.error('Failed to load statuses:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadStatuses()
  }, [])

  /**
   * Handles adding a new status
   * In a production environment, this would make an API call
   */
  const handleAddStatus = async () => {
    if (!newStatus.name || !newStatus.color) {
      alert('Please provide a name and color for the status')
      return
    }

    // Generate a unique ID for the new status
    const statusId = `status-${Date.now()}`
    
    const createdStatus: Status = {
      statusId,
      name: newStatus.name,
      description: newStatus.description || '',
      color: newStatus.color,
      category: newStatus.category || 'Operational',
      priority: newStatus.priority || 3,
      organizationId: newStatus.organizationId || 'org-001',
      isDefault: newStatus.isDefault || false,
      isActive: newStatus.isActive || true
    }
    
    // Update local state
    const updatedStatuses = [...statuses, createdStatus]
    setStatuses(updatedStatuses)
    
    // Persist to storage
    await spaceBuilderService.saveStatuses(updatedStatuses)
    
    // Reset form
    setNewStatus({
      organizationId: 'org-001',
      priority: 3,
      isActive: true,
      isDefault: false
    })
    
    // Close dialog
    setIsAddDialogOpen(false)
  }

  /**
   * Handles deleting a status
   * @param statusId - ID of the status to delete
   */
  const handleDeleteStatus = async (statusId: string) => {
    // Check if this is a default status
    const statusToDelete = statuses.find(status => status.statusId === statusId)
    
    if (statusToDelete?.isDefault) {
      if (!window.confirm('This is a default status. Deleting it may affect system functionality. Are you sure you want to proceed?')) {
        return
      }
    } else if (!window.confirm('Are you sure you want to delete this status?')) {
      return
    }
    
    // Update local state by filtering out the deleted status
    const updatedStatuses = statuses.filter(status => status.statusId !== statusId)
    setStatuses(updatedStatuses)
    
    // Persist to storage
    await spaceBuilderService.saveStatuses(updatedStatuses)
  }

  /**
   * Enters edit mode for a status
   * @param status - The status to edit
   */
  const startEditingStatus = (status: Status) => {
    setEditingStatus({ ...status })
  }

  /**
   * Saves changes to an edited status
   */
  const saveEditedStatus = async () => {
    if (!editingStatus) return
    
    // Update the status in our local state
    const updatedStatuses = statuses.map(status => 
      status.statusId === editingStatus.statusId ? editingStatus : status
    )
    setStatuses(updatedStatuses)
    
    // Persist to storage
    await spaceBuilderService.saveStatuses(updatedStatuses)
    
    // Exit edit mode
    setEditingStatus(null)
  }

  /**
   * Cancels the current edit operation
   */
  const cancelEditing = () => {
    setEditingStatus(null)
  }

  /**
   * Handles input changes for edited status
   */
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingStatus) return
    
    setEditingStatus({
      ...editingStatus,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handles select changes for edited status
   */
  const handleEditSelectChange = (name: string, value: string) => {
    if (!editingStatus) return
    
    setEditingStatus({
      ...editingStatus,
      [name]: value
    })
  }

  /**
   * Handles input changes for new status form
   */
  const handleNewStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStatus({
      ...newStatus,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handles select changes for new status form
   */
  const handleNewStatusSelectChange = (name: string, value: string) => {
    setNewStatus({
      ...newStatus,
      [name]: value
    })
  }

  /**
   * Renders a color preview box
   */
  const ColorPreview = ({ color }: { color: string }) => (
    <div 
      className="w-6 h-6 rounded-full mr-2 inline-block" 
      style={{ backgroundColor: color || '#ccc' }}
    />
  )

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading statuses...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Status Management
        </h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Status
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Status</DialogTitle>
              <DialogDescription>
                Create a new status that will be available in the space builder.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={newStatus.name || ''}
                  onChange={handleNewStatusChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  name="description"
                  value={newStatus.description || ''}
                  onChange={handleNewStatusChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="color" className="text-right text-sm font-medium">
                  Color
                </label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    value={newStatus.color || '#cccccc'}
                    onChange={handleNewStatusChange}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    name="color"
                    value={newStatus.color || ''}
                    onChange={handleNewStatusChange}
                    className="ml-2 flex-1"
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="category" className="text-right text-sm font-medium">
                  Category
                </label>
                <Select 
                  onValueChange={(value) => handleNewStatusSelectChange('category', value)}
                  defaultValue="Operational"
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="priority" className="text-right text-sm font-medium">
                  Priority
                </label>
                <Select 
                  onValueChange={(value) => handleNewStatusSelectChange('priority', value)}
                  defaultValue="3"
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">High (1)</SelectItem>
                    <SelectItem value="2">Medium-High (2)</SelectItem>
                    <SelectItem value="3">Medium (3)</SelectItem>
                    <SelectItem value="4">Medium-Low (4)</SelectItem>
                    <SelectItem value="5">Low (5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStatus}>
                Add Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>List of available statuses for the space builder</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Color</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[100px]">Default</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No statuses found. Add your first status to get started.
                </TableCell>
              </TableRow>
            ) : (
              statuses.map(status => (
                <TableRow key={status.statusId}>
                  {editingStatus?.statusId === status.statusId ? (
                    // Edit mode
                    <>
                      <TableCell>
                        <Input
                          type="color"
                          name="color"
                          value={editingStatus.color || '#cccccc'}
                          onChange={handleEditChange}
                          className="w-10 h-10 p-1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="name"
                          value={editingStatus.name}
                          onChange={handleEditChange}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="description"
                          value={editingStatus.description || ''}
                          onChange={handleEditChange}
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          onValueChange={(value) => handleEditSelectChange('category', value)}
                          defaultValue={editingStatus.category || 'Operational'}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusCategories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select 
                          onValueChange={(value) => handleEditSelectChange('priority', value)}
                          defaultValue={String(editingStatus.priority || 3)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">High (1)</SelectItem>
                            <SelectItem value="2">Medium-High (2)</SelectItem>
                            <SelectItem value="3">Medium (3)</SelectItem>
                            <SelectItem value="4">Medium-Low (4)</SelectItem>
                            <SelectItem value="5">Low (5)</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select 
                          onValueChange={(value) => handleEditSelectChange('isDefault', value)}
                          defaultValue={editingStatus.isDefault ? 'true' : 'false'}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={saveEditedStatus}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={cancelEditing}>
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    // View mode
                    <>
                      <TableCell>
                        <ColorPreview color={status.color || '#ccc'} />
                      </TableCell>
                      <TableCell>{status.name}</TableCell>
                      <TableCell>{status.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{status.category || 'Operational'}</Badge>
                      </TableCell>
                      <TableCell>
                        {status.priority === 1 && <Badge className="bg-red-500">High</Badge>}
                        {status.priority === 2 && <Badge className="bg-orange-500">Medium-High</Badge>}
                        {status.priority === 3 && <Badge className="bg-blue-500">Medium</Badge>}
                        {status.priority === 4 && <Badge className="bg-green-500">Medium-Low</Badge>}
                        {status.priority === 5 && <Badge className="bg-gray-500">Low</Badge>}
                      </TableCell>
                      <TableCell>
                        {status.isDefault ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => startEditingStatus(status)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteStatus(status.statusId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 