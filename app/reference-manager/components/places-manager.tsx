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
  MapPin, 
  Plus, 
  Pencil, 
  Trash2, 
  Save
} from 'lucide-react'
import { SpaceBuilderService } from '@/lib/services/space-builder-service'
import type { Place } from '@/lib/types/space-builder'

// Initialize the service
const spaceBuilderService = new SpaceBuilderService()

/**
 * PlacesManager Component
 * 
 * A comprehensive interface for managing place data within the reference manager.
 * This component provides a full CRUD (Create, Read, Update, Delete) interface
 * for working with place data, which is used in the space builder's left sidebar
 * for location selection.
 * 
 * Features:
 * - Tabular view of all places with sorting and filtering
 * - Add new places via modal dialog
 * - Edit existing place details
 * - Delete places with confirmation
 * - Real-time updates to the places list
 */
export function PlacesManager() {
  // State management
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPlace, setNewPlace] = useState<Partial<Place>>({
    organizationId: 'org-001', // Default organization ID
  })

  // Load places on component mount
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoading(true)
        const { places } = await spaceBuilderService.getPlaces()
        setPlaces(places)
      } catch (error) {
        console.error('Failed to load places:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPlaces()
  }, [])

  /**
   * Handles adding a new place
   * In a production environment, this would make an API call
   */
  const handleAddPlace = async () => {
    if (!newPlace.name || !newPlace.organizationId) {
      alert('Please provide at least a name for the place')
      return
    }

    // Generate a unique ID for the new place
    const placeId = `place-${Date.now()}`
    
    const createdPlace: Place = {
      placeId,
      name: newPlace.name,
      city: newPlace.city || '',
      state: newPlace.state || '',
      organizationId: newPlace.organizationId,
      streetAddress: newPlace.streetAddress || '',
      postalCode: newPlace.postalCode || '',
      geolocation: newPlace.geolocation || ''
    }
    
    // Update local state
    const updatedPlaces = [...places, createdPlace]
    setPlaces(updatedPlaces)
    
    // Persist to storage
    await spaceBuilderService.savePlaces(updatedPlaces)
    
    // Reset form
    setNewPlace({
      organizationId: 'org-001',
    })
    
    // Close dialog
    setIsAddDialogOpen(false)
  }

  /**
   * Handles deleting a place
   * @param placeId - ID of the place to delete
   */
  const handleDeletePlace = async (placeId: string) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      // Update local state by filtering out the deleted place
      const updatedPlaces = places.filter(place => place.placeId !== placeId)
      setPlaces(updatedPlaces)
      
      // Persist to storage
      await spaceBuilderService.savePlaces(updatedPlaces)
    }
  }

  /**
   * Enters edit mode for a place
   * @param place - The place to edit
   */
  const startEditingPlace = (place: Place) => {
    setEditingPlace({ ...place })
  }

  /**
   * Saves changes to an edited place
   */
  const saveEditedPlace = async () => {
    if (!editingPlace) return
    
    // Update the place in our local state
    const updatedPlaces = places.map(place => 
      place.placeId === editingPlace.placeId ? editingPlace : place
    )
    setPlaces(updatedPlaces)
    
    // Persist to storage
    await spaceBuilderService.savePlaces(updatedPlaces)
    
    // Exit edit mode
    setEditingPlace(null)
  }

  /**
   * Cancels the current edit operation
   */
  const cancelEditing = () => {
    setEditingPlace(null)
  }

  /**
   * Handles input changes for edited place
   */
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingPlace) return
    
    setEditingPlace({
      ...editingPlace,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handles input changes for new place form
   */
  const handleNewPlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlace({
      ...newPlace,
      [e.target.name]: e.target.value
    })
  }

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading places...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Places Management
        </h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Place
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Place</DialogTitle>
              <DialogDescription>
                Create a new place that will be available in the space builder.
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
                  value={newPlace.name || ''}
                  onChange={handleNewPlaceChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="city" className="text-right text-sm font-medium">
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  value={newPlace.city || ''}
                  onChange={handleNewPlaceChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="state" className="text-right text-sm font-medium">
                  State
                </label>
                <Input
                  id="state"
                  name="state"
                  value={newPlace.state || ''}
                  onChange={handleNewPlaceChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="streetAddress" className="text-right text-sm font-medium">
                  Address
                </label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={newPlace.streetAddress || ''}
                  onChange={handleNewPlaceChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="postalCode" className="text-right text-sm font-medium">
                  Postal Code
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={newPlace.postalCode || ''}
                  onChange={handleNewPlaceChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPlace}>
                Add Place
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>List of all available places</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {places.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No places found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              places.map((place) => (
                <TableRow key={place.placeId}>
                  <TableCell className="font-medium">
                    {editingPlace?.placeId === place.placeId ? (
                      <Input
                        name="name"
                        value={editingPlace.name}
                        onChange={handleEditChange}
                      />
                    ) : (
                      place.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPlace?.placeId === place.placeId ? (
                      <div className="flex space-x-2">
                        <Input
                          name="city"
                          value={editingPlace.city || ''}
                          onChange={handleEditChange}
                          placeholder="City"
                          className="w-1/2"
                        />
                        <Input
                          name="state"
                          value={editingPlace.state || ''}
                          onChange={handleEditChange}
                          placeholder="State"
                          className="w-1/2"
                        />
                      </div>
                    ) : (
                      <>
                        {place.city}
                        {place.city && place.state && ', '}
                        {place.state}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPlace?.placeId === place.placeId ? (
                      <div className="flex space-x-2">
                        <Input
                          name="streetAddress"
                          value={editingPlace.streetAddress || ''}
                          onChange={handleEditChange}
                          placeholder="Street Address"
                          className="w-2/3"
                        />
                        <Input
                          name="postalCode"
                          value={editingPlace.postalCode || ''}
                          onChange={handleEditChange}
                          placeholder="Postal Code"
                          className="w-1/3"
                        />
                      </div>
                    ) : (
                      <>
                        {place.streetAddress}
                        {place.streetAddress && place.postalCode && ', '}
                        {place.postalCode}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPlace?.placeId === place.placeId ? (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveEditedPlace}
                          title="Save changes"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                          title="Cancel editing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingPlace(place)}
                          title="Edit place"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePlace(place.placeId)}
                          title="Delete place"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 