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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  Save,
  UserCog,
  UserPlus,
  Shield,
  Tags
} from 'lucide-react'
import { SpaceBuilderService } from '@/lib/services/space-builder-service'
import type { User, Group, UserRole } from '@/lib/types/team-management'
import { Badge } from '@/components/ui/badge'

// Initialize the service
const spaceBuilderService = new SpaceBuilderService()

/**
 * UsersManagement Component
 * 
 * A comprehensive interface for managing users and their group assignments
 * within the system. This component provides a full CRUD (Create, Read, Update, Delete)
 * interface for users, along with the ability to assign them to specific groups.
 * 
 * Features:
 * - Tabular view of all users with rich data display
 * - Add new users with role selection
 * - Edit existing user details
 * - Delete users with confirmation
 * - Assign/unassign users to groups via dropdown
 * - Visual indicators for user roles and group memberships
 * - Group filtering and management
 */
export function UsersManagement() {
  // State management
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState<Partial<User>>({
    role: 'viewer' as UserRole,
    groupIds: []
  })

  // Load users and groups on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const { users = [] } = await spaceBuilderService.getUsers()
        const { groups = [] } = await spaceBuilderService.getGroups()
        
        setUsers(users)
        setGroups(groups)
      } catch (error) {
        console.error('Failed to load users and groups:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  /**
   * Handles adding a new user
   * Creates a new user with the provided information and adds them to the system
   */
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert('Please fill in all required fields (name, email, role)')
      return
    }

    // Generate a unique ID for the new user
    const userId = `user-${Date.now()}`
    
    const createdUser: User = {
      userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      department: newUser.department || '',
      title: newUser.title || '',
      groupIds: newUser.groupIds || []
    }
    
    // Update local state
    const updatedUsers = [...users, createdUser]
    setUsers(updatedUsers)
    
    // Persist to storage
    await spaceBuilderService.saveUsers(updatedUsers)
    
    // Reset form
    setNewUser({
      role: 'viewer' as UserRole,
      groupIds: []
    })
    
    // Close dialog
    setIsAddDialogOpen(false)
  }

  /**
   * Handles deleting a user
   * Removes a user from the system after confirmation
   * @param userId - The ID of the user to delete
   */
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Update local state by filtering out the deleted user
      const updatedUsers = users.filter(user => user.userId !== userId)
      setUsers(updatedUsers)
      
      // Persist to storage
      await spaceBuilderService.saveUsers(updatedUsers)
    }
  }

  /**
   * Enters edit mode for a user
   * @param user - The user to edit
   */
  const startEditingUser = (user: User) => {
    setEditingUser({ ...user })
  }

  /**
   * Saves changes to an edited user
   * Updates the user information in the system
   */
  const saveEditedUser = async () => {
    if (!editingUser) return
    
    // Update the user in our local state
    const updatedUsers = users.map(user => 
      user.userId === editingUser.userId ? editingUser : user
    )
    setUsers(updatedUsers)
    
    // Persist to storage
    await spaceBuilderService.saveUsers(updatedUsers)
    
    // Exit edit mode
    setEditingUser(null)
  }

  /**
   * Cancels the current edit operation
   * Discards any changes made to the user
   */
  const cancelEditing = () => {
    setEditingUser(null)
  }

  /**
   * Handles input changes for edited user
   * @param e - The change event from the input field
   */
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser) return
    
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handles role change for edited user
   * @param role - The new role to assign to the user
   */
  const handleRoleChange = (role: UserRole) => {
    if (!editingUser) return
    
    setEditingUser({
      ...editingUser,
      role
    })
  }

  /**
   * Handles new user role change
   * @param role - The role to assign to the new user
   */
  const handleNewUserRoleChange = (role: UserRole) => {
    setNewUser({
      ...newUser,
      role
    })
  }

  /**
   * Handles input changes for new user form
   * @param e - The change event from the input field
   */
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Toggles a group assignment for a user
   * Adds or removes a user from a specific group
   * @param user - The user to modify group assignments for
   * @param groupId - The ID of the group to toggle
   */
  const toggleUserGroup = async (user: User, groupId: string) => {
    const userToUpdate = users.find(u => u.userId === user.userId)
    if (!userToUpdate) return
    
    let updatedGroupIds: string[]
    
    if (userToUpdate.groupIds.includes(groupId)) {
      // Remove the group
      updatedGroupIds = userToUpdate.groupIds.filter(id => id !== groupId)
    } else {
      // Add the group
      updatedGroupIds = [...userToUpdate.groupIds, groupId]
    }
    
    // Update the user with new group assignments
    const updatedUser = { ...userToUpdate, groupIds: updatedGroupIds }
    
    // Update the users array
    const updatedUsers = users.map(u => 
      u.userId === user.userId ? updatedUser : u
    )
    
    // Update state and persist
    setUsers(updatedUsers)
    await spaceBuilderService.saveUsers(updatedUsers)
  }

  /**
   * Get user role badge variant based on role
   * Determines the visual style of the role badge
   * @param role - The user role to get a badge variant for
   * @returns The badge variant name to use
   */
  const getRoleBadgeVariant = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'destructive'
      case 'manager': return 'default'
      case 'editor': return 'secondary'
      case 'viewer': return 'outline'
      default: return 'outline'
    }
  }

  /**
   * Get group membership for a user
   * @param user - The user to get groups for
   * @returns Array of groups the user belongs to
   */
  const getUserGroups = (user: User) => {
    return groups.filter(group => user.groupIds.includes(group.groupId))
  }

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading users and groups...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <Users className="mr-2 h-5 w-5" />
          User Management
        </h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user and assign them to groups.
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
                  value={newUser.name || ''}
                  onChange={handleNewUserChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  value={newUser.email || ''}
                  onChange={handleNewUserChange}
                  className="col-span-3"
                  required
                  type="email"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right text-sm font-medium">
                  Role
                </label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => handleNewUserRoleChange(value as UserRole)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="department" className="text-right text-sm font-medium">
                  Department
                </label>
                <Input
                  id="department"
                  name="department"
                  value={newUser.department || ''}
                  onChange={handleNewUserChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right text-sm font-medium">
                  Job Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={newUser.title || ''}
                  onChange={handleNewUserChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>List of all users in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No users found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-medium">
                    {editingUser?.userId === user.userId ? (
                      <div className="space-y-2">
                        <Input
                          name="name"
                          value={editingUser.name}
                          onChange={handleEditChange}
                          placeholder="Name"
                        />
                        <Input
                          name="email"
                          value={editingUser.email}
                          onChange={handleEditChange}
                          placeholder="Email"
                          type="email"
                        />
                      </div>
                    ) : (
                      <div>
                        <div>{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.userId === user.userId ? (
                      <Select 
                        value={editingUser.role} 
                        onValueChange={(value) => handleRoleChange(value as UserRole)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.userId === user.userId ? (
                      <Input
                        name="department"
                        value={editingUser.department || ''}
                        onChange={handleEditChange}
                        placeholder="Department"
                      />
                    ) : (
                      <div>
                        <div>{user.department || '—'}</div>
                        <div className="text-sm text-muted-foreground">{user.title || ''}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Tags className="h-3 w-3 mr-1" />
                          Groups ({user.groupIds.length})
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Assigned Groups</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {groups.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No groups available
                          </div>
                        ) : (
                          groups.map((group) => (
                            <DropdownMenuCheckboxItem
                              key={group.groupId}
                              checked={user.groupIds.includes(group.groupId)}
                              onCheckedChange={() => toggleUserGroup(user, group.groupId)}
                            >
                              {group.name}
                            </DropdownMenuCheckboxItem>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {getUserGroups(user).map(group => (
                        <Badge 
                          key={group.groupId} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {group.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingUser?.userId === user.userId ? (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveEditedUser}
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
                          onClick={() => startEditingUser(user)}
                          title="Edit user"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.userId)}
                          title="Delete user"
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