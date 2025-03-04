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
import { Badge } from '@/components/ui/badge'
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { 
  Users, 
  UserPlus, 
  Plus, 
  Pencil, 
  Trash2, 
  Save,
  UserCog,
  Shield,
  Globe,
  Eye,
  Settings,
  CheckSquare,
  XSquare,
  ChevronDown,
  PlusCircle
} from 'lucide-react'
import { SpaceBuilderService } from '@/lib/services/space-builder-service'
import type { User, Group, Team, UserRole } from '@/lib/types/team-management'
import { cn } from '@/lib/utils'

// Initialize the service
const spaceBuilderService = new SpaceBuilderService()

/**
 * Helper function to get the appropriate role icon
 */
const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return <Shield className="h-4 w-4 text-red-500" />
    case 'manager':
      return <UserCog className="h-4 w-4 text-blue-500" />
    case 'editor':
      return <Globe className="h-4 w-4 text-green-500" />
    case 'viewer':
      return <Eye className="h-4 w-4 text-gray-500" />
    default:
      return <Eye className="h-4 w-4 text-gray-500" />
  }
}

/**
 * Helper function to format a date string
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * TeamsManager Component
 * 
 * A comprehensive interface for managing teams, users, and groups within the system.
 * This component provides tabs for managing different aspects of team management:
 * - Users: Add/edit/delete users and assign them to groups
 * - Groups: Create and manage groups with descriptions
 * 
 * Features:
 * - Create, read, update, and delete operations for users and groups
 * - Assignment of users to groups with visual indicators
 * - Role management with appropriate permissions
 * - Input validation and error handling
 * - Persistence to localStorage via the SpaceBuilderService
 */
export function TeamsManager() {
  // State for users management
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  
  // User edit states
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState<Partial<User>>({
    role: 'viewer',
    groupIds: []
  })
  
  // Group edit states
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false)
  const [newGroup, setNewGroup] = useState<Partial<Group>>({
    description: ''
  })
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('users')

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const { users = [] } = await spaceBuilderService.getUsers()
        const { groups = [] } = await spaceBuilderService.getGroups()
        const { teams = [] } = await spaceBuilderService.getTeams()
        
        setUsers(users)
        setGroups(groups)
        setTeams(teams)
      } catch (error) {
        console.error('Failed to load team data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  /**
   * USER MANAGEMENT FUNCTIONS
   */
  
  /**
   * Handle adding a new user
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
      role: 'viewer',
      groupIds: []
    })
    
    // Close dialog
    setIsAddUserDialogOpen(false)
  }

  /**
   * Handle deleting a user
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
   * Start editing a user
   */
  const startEditingUser = (user: User) => {
    setEditingUser({ ...user })
  }

  /**
   * Save changes to an edited user
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
   * Cancel editing a user
   */
  const cancelEditingUser = () => {
    setEditingUser(null)
  }

  /**
   * Handle input changes for edited user
   */
  const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser) return
    
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handle role change for edited user
   */
  const handleEditUserRoleChange = (role: UserRole) => {
    if (!editingUser) return
    
    setEditingUser({
      ...editingUser,
      role
    })
  }

  /**
   * Handle input changes for new user form
   */
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handle role change for new user
   */
  const handleNewUserRoleChange = (role: UserRole) => {
    setNewUser({
      ...newUser,
      role
    })
  }

  /**
   * Toggle a group assignment for a user
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
   * GROUP MANAGEMENT FUNCTIONS
   */
  
  /**
   * Handle adding a new group
   */
  const handleAddGroup = async () => {
    if (!newGroup.name) {
      alert('Please provide a name for the group')
      return
    }

    // Generate a unique ID for the new group
    const groupId = `group-${Date.now()}`
    
    // Find first admin user as default creator
    const adminUser = users.find(user => user.role === 'admin')
    const creatorId = adminUser?.userId || 'unknown'
    
    const createdGroup: Group = {
      groupId,
      name: newGroup.name,
      description: newGroup.description || '',
      createdBy: creatorId,
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
      description: ''
    })
    
    // Close dialog
    setIsAddGroupDialogOpen(false)
  }

  /**
   * Handle deleting a group
   */
  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      // Update local state by filtering out the deleted group
      const updatedGroups = groups.filter(group => group.groupId !== groupId)
      setGroups(updatedGroups)
      
      // Need to update any users who are in this group
      const updatedUsers = users.map(user => {
        if (user.groupIds.includes(groupId)) {
          return {
            ...user,
            groupIds: user.groupIds.filter(id => id !== groupId)
          }
        }
        return user
      })
      
      // Persist both changes to storage
      await spaceBuilderService.saveGroups(updatedGroups)
      await spaceBuilderService.saveUsers(updatedUsers)
      setUsers(updatedUsers)
    }
  }

  /**
   * Start editing a group
   */
  const startEditingGroup = (group: Group) => {
    setEditingGroup({ ...group })
  }

  /**
   * Save changes to an edited group
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
   * Cancel editing a group
   */
  const cancelEditingGroup = () => {
    setEditingGroup(null)
  }

  /**
   * Handle input changes for edited group
   */
  const handleEditGroupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingGroup) return
    
    setEditingGroup({
      ...editingGroup,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handle input changes for new group form
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
   * Calculate the actual number of members in a group
   */
  const getGroupMemberCount = (groupId: string): number => {
    return users.filter(user => user.groupIds.includes(groupId)).length
  }

  /**
   * Get the creator name for a group
   */
  const getGroupCreatorName = (creatorId: string): string => {
    const creator = users.find(user => user.userId === creatorId)
    return creator?.name || 'Unknown'
  }

  /**
   * Get group names for a user by their groupIds
   */
  const getUserGroupNames = (groupIds: string[]): string[] => {
    return groupIds.map(groupId => {
      const group = groups.find(g => g.groupId === groupId)
      return group?.name || 'Unknown Group'
    })
  }

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading team data...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Teams Management
        </h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Groups</span>
          </TabsTrigger>
        </TabsList>
        
        {/* USERS TAB */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between">
            <div>
              <Button
                onClick={() => setIsAddUserDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableCaption>List of all system users</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name & Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Groups</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No users found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        {editingUser?.userId === user.userId ? (
                          <div className="space-y-2">
                            <Input
                              name="name"
                              value={editingUser.name}
                              onChange={handleEditUserChange}
                              placeholder="Full Name"
                            />
                            <Select 
                              value={editingUser.role} 
                              onValueChange={(value) => handleEditUserRoleChange(value as UserRole)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Administrator</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              {getRoleIcon(user.role)}
                              <span className="ml-1 capitalize">{user.role}</span>
                            </div>
                            {user.title && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {user.title} {user.department && `(${user.department})`}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingUser?.userId === user.userId ? (
                          <div className="space-y-2">
                            <Input
                              name="email"
                              value={editingUser.email}
                              onChange={handleEditUserChange}
                              placeholder="Email"
                            />
                            <Input
                              name="department"
                              value={editingUser.department || ''}
                              onChange={handleEditUserChange}
                              placeholder="Department"
                            />
                            <Input
                              name="title"
                              value={editingUser.title || ''}
                              onChange={handleEditUserChange}
                              placeholder="Job Title"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm">{user.email}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {groups.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {getUserGroupNames(user.groupIds).map((groupName, idx) => (
                              <Badge key={idx} variant="outline">
                                {groupName}
                              </Badge>
                            ))}
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Manage Group Assignments</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                  {groups.map(group => (
                                    <DropdownMenuItem
                                      key={group.groupId}
                                      onClick={() => toggleUserGroup(user, group.groupId)}
                                    >
                                      {user.groupIds.includes(group.groupId) ? (
                                        <CheckSquare className="mr-2 h-4 w-4 text-green-500" />
                                      ) : (
                                        <XSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                                      )}
                                      {group.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">
                            No groups available
                          </div>
                        )}
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
                              onClick={cancelEditingUser}
                              title="Cancel editing"
                            >
                              <XSquare className="h-4 w-4" />
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
          
          {/* Add User Dialog */}
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with appropriate role and group assignments.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Name*
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
                    Email*
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email || ''}
                    onChange={handleNewUserChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role" className="text-right text-sm font-medium">
                    Role*
                  </label>
                  <Select 
                    value={newUser.role as string} 
                    onValueChange={(value) => handleNewUserRoleChange(value as UserRole)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Role" />
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
                <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* GROUPS TAB */}
        <TabsContent value="groups" className="space-y-4">
          <div className="flex justify-between">
            <div>
              <Button
                onClick={() => setIsAddGroupDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Group</span>
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableCaption>List of all user groups</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No groups found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  groups.map((group) => (
                    <TableRow key={group.groupId}>
                      <TableCell className="font-medium">
                        {editingGroup?.groupId === group.groupId ? (
                          <Input
                            name="name"
                            value={editingGroup.name}
                            onChange={handleEditGroupChange}
                            placeholder="Group Name"
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
                            onChange={handleEditGroupChange}
                            placeholder="Description"
                            className="min-h-[80px]"
                          />
                        ) : (
                          <div className="max-w-md">
                            {group.description || (
                              <span className="text-muted-foreground italic">No description</span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">Created by:</span>{' '}
                            {getGroupCreatorName(group.createdBy)}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Created:</span>{' '}
                            {formatDate(group.createdAt)}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Members:</span>{' '}
                            {getGroupMemberCount(group.groupId)}
                          </div>
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
                              onClick={cancelEditingGroup}
                              title="Cancel editing"
                            >
                              <XSquare className="h-4 w-4" />
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Add Group Dialog */}
          <Dialog open={isAddGroupDialogOpen} onOpenChange={setIsAddGroupDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Group</DialogTitle>
                <DialogDescription>
                  Create a new user group for organizing team members.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Name*
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
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newGroup.description || ''}
                    onChange={handleNewGroupChange}
                    className="col-span-3 min-h-[100px]"
                    placeholder="Describe the purpose of this group"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddGroupDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGroup}>
                  Add Group
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
} 