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
import { Textarea } from '@/components/ui/textarea'
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
  UsersRound, 
  Plus, 
  Pencil, 
  Trash2, 
  Save,
  FolderPlus,
  Users,
  UserPlus 
} from 'lucide-react'
import { SpaceBuilderService } from '@/lib/services/space-builder-service'
import type { User, Group } from '@/lib/types/team-management'
import { Badge } from '@/components/ui/badge'

// Initialize the service
const spaceBuilderService = new SpaceBuilderService()

/**
 * GroupsManagement Component
 * 
 * A comprehensive interface for managing groups within the teams system.
 * This component provides a full CRUD (Create, Read, Update, Delete) 
 * interface for groups and displays information about group membership.
 * 
 * Features:
 * - Tabular view of all groups with membership counts
 * - Add new groups with descriptions
 * - Edit existing group details
 * - Delete groups with confirmation
 * - View members of each group
 * - Track group creation and modification
 */
export function GroupsManagement() {
  // State management
  const [groups, setGroups] = useState<Group[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newGroup, setNewGroup] = useState<Partial<Group>>({
    memberCount: 0,
    createdAt: new Date().toISOString()
  })

  // Load groups and users on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const { groups = [] } = await spaceBuilderService.getGroups()
        const { users = [] } = await spaceBuilderService.getUsers()
        
        setGroups(groups)
        setUsers(users)
      } catch (error) {
        console.error('Failed to load groups and users:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  /**
   * Handles adding a new group
   */
  const handleAddGroup = async () => {
    if (!newGroup.name) {
      alert('Please provide a group name')
      return
    }

    // Generate a unique ID for the new group
    const groupId = `group-${Date.now()}`
    
    const createdGroup: Group = {
      groupId,
      name: newGroup.name,
      description: newGroup.description || '',
      createdBy: 'current-user', // In a real app, this would be the current user's ID
      createdAt: new Date().toISOString(),
      memberCount: 0
    }
    
    // Update local state
    const updatedGroups = [...groups, createdGroup]
    setGroups(updatedGroups)
    
    // Persist to storage
    await spaceBuilderService.saveGroups(updatedGroups)
    
    // Reset form
    setNewGroup({
      memberCount: 0,
      createdAt: new Date().toISOString()
    })
    
    // Close dialog
    setIsAddDialogOpen(false)
  }

  /**
   * Handles deleting a group
   */
  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      // Check if any users are part of this group
      const usersInGroup = users.filter(user => user.groupIds.includes(groupId))
      
      if (usersInGroup.length > 0) {
        // Update each user to remove this group
        const updatedUsers = users.map(user => {
          if (user.groupIds.includes(groupId)) {
            return {
              ...user,
              groupIds: user.groupIds.filter(id => id !== groupId)
            }
          }
          return user
        })
        
        // Persist updated users
        await spaceBuilderService.saveUsers(updatedUsers)
        setUsers(updatedUsers)
      }
      
      // Update local state by filtering out the deleted group
      const updatedGroups = groups.filter(group => group.groupId !== groupId)
      setGroups(updatedGroups)
      
      // Persist to storage
      await spaceBuilderService.saveGroups(updatedGroups)
    }
  }

  /**
   * Enters edit mode for a group
   */
  const startEditingGroup = (group: Group) => {
    setEditingGroup({ ...group })
  }

  /**
   * Saves changes to an edited group
   */
  const saveEditedGroup = async () => {
    if (!editingGroup) return
    
    // Update the group in our local state
    const updatedGroups = groups.map(group => 
      group.groupId === editingGroup.groupId ? editingGroup : group
    )
    setGroups(updatedGroups)
    
    // Persist to storage
    await spaceBuilderService.saveGroups(updatedGroups)
    
    // Exit edit mode
    setEditingGroup(null)
  }

  /**
   * Cancels the current edit operation
   */
  const cancelEditing = () => {
    setEditingGroup(null)
  }

  /**
   * Handles input changes for edited group
   */
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingGroup) return
    
    setEditingGroup({
      ...editingGroup,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handles input changes for new group form
   */
  const handleNewGroupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewGroup({
      ...newGroup,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Get actual member count for a group
   */
  const getGroupMemberCount = (groupId: string) => {
    return users.filter(user => user.groupIds.includes(groupId)).length
  }

  /**
   * Get users that belong to a group
   */
  const getGroupMembers = (groupId: string) => {
    return users.filter(user => user.groupIds.includes(groupId))
  }

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading groups...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <UsersRound className="mr-2 h-5 w-5" />
          Group Management
        </h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Add a new group to organize users and assign responsibilities.
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
                  value={newGroup.name || ''}
                  onChange={handleNewGroupChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium pt-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={newGroup.description || ''}
                  onChange={handleNewGroupChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGroup}>
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>List of all groups in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No groups found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group) => {
                // Get actual member count
                const memberCount = getGroupMemberCount(group.groupId)
                
                return (
                  <TableRow key={group.groupId}>
                    <TableCell className="font-medium">
                      {editingGroup?.groupId === group.groupId ? (
                        <Input
                          name="name"
                          value={editingGroup.name}
                          onChange={handleEditChange}
                          placeholder="Group name"
                        />
                      ) : (
                        group.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingGroup?.groupId === group.groupId ? (
                        <Textarea
                          name="description"
                          value={editingGroup.description}
                          onChange={handleEditChange}
                          placeholder="Group description"
                          rows={2}
                        />
                      ) : (
                        <div className="max-w-md truncate">
                          {group.description || <span className="text-muted-foreground">No description</span>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{memberCount}</span>
                      </div>
                      
                      {/* Show member avatars or names if there are any */}
                      {memberCount > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {getGroupMembers(group.groupId).slice(0, 3).map(user => (
                            <Badge 
                              key={user.userId} 
                              variant="outline"
                              className="text-xs"
                            >
                              {user.name}
                            </Badge>
                          ))}
                          {memberCount > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{memberCount - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingGroup?.groupId === group.groupId ? (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={saveEditedGroup}
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
                            onClick={() => startEditingGroup(group)}
                            title="Edit group"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGroup(group.groupId)}
                            title="Delete group"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 