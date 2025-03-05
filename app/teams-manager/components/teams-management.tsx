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
  Layers, 
  Plus, 
  Pencil, 
  Trash2, 
  Save,
  FolderPlus,
  Users as UsersIcon,
  UserIcon,
  Tags,
  Crown
} from 'lucide-react'
import { SpaceBuilderService } from '@/lib/services/space-builder-service'
import type { User, Group, Team } from '@/lib/types/team-management'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

// Initialize the service
const spaceBuilderService = new SpaceBuilderService()

/**
 * TeamsManagement Component
 * 
 * A comprehensive interface for managing teams within the organization.
 * Teams consist of a team lead and multiple associated groups.
 * 
 * Features:
 * - Tabular view of all teams with detailed information
 * - Add new teams with lead and group assignments
 * - Edit existing team details and group assignments
 * - Delete teams with confirmation
 * - Visual representation of team composition
 * - Intuitive interfaces for managing team structure
 */
export function TeamsManagement() {
  // State management
  const [teams, setTeams] = useState<Team[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    groupIds: []
  })

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const { teams = [] } = await spaceBuilderService.getTeams()
        const { users = [] } = await spaceBuilderService.getUsers()
        const { groups = [] } = await spaceBuilderService.getGroups()
        
        setTeams(teams)
        setUsers(users)
        setGroups(groups)
      } catch (error) {
        console.error('Failed to load teams data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  /**
   * Handles adding a new team
   */
  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.leadId) {
      alert('Please provide a team name and select a team lead')
      return
    }

    // Generate a unique ID for the new team
    const teamId = `team-${Date.now()}`
    
    const createdTeam: Team = {
      teamId,
      name: newTeam.name,
      description: newTeam.description || '',
      leadId: newTeam.leadId,
      groupIds: newTeam.groupIds || []
    }
    
    // Update local state
    const updatedTeams = [...teams, createdTeam]
    setTeams(updatedTeams)
    
    // Persist to storage
    await spaceBuilderService.saveTeams(updatedTeams)
    
    // Reset form
    setNewTeam({
      groupIds: []
    })
    
    // Close dialog
    setIsAddDialogOpen(false)
  }

  /**
   * Handles deleting a team
   */
  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      // Update local state by filtering out the deleted team
      const updatedTeams = teams.filter(team => team.teamId !== teamId)
      setTeams(updatedTeams)
      
      // Persist to storage
      await spaceBuilderService.saveTeams(updatedTeams)
    }
  }

  /**
   * Enters edit mode for a team
   */
  const startEditingTeam = (team: Team) => {
    setEditingTeam({ ...team })
  }

  /**
   * Saves changes to an edited team
   */
  const saveEditedTeam = async () => {
    if (!editingTeam) return
    
    // Update the team in our local state
    const updatedTeams = teams.map(team => 
      team.teamId === editingTeam.teamId ? editingTeam : team
    )
    setTeams(updatedTeams)
    
    // Persist to storage
    await spaceBuilderService.saveTeams(updatedTeams)
    
    // Exit edit mode
    setEditingTeam(null)
  }

  /**
   * Cancels the current edit operation
   */
  const cancelEditing = () => {
    setEditingTeam(null)
  }

  /**
   * Handles input changes for edited team
   */
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingTeam) return
    
    setEditingTeam({
      ...editingTeam,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handles input changes for new team form
   */
  const handleNewTeamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewTeam({
      ...newTeam,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handles lead change for a team
   * Updates the lead user for a team being created or edited
   * @param userId - The ID of the user to set as lead
   * @param isNew - Whether this is for a new team being created
   */
  const handleLeadChange = (userId: string, isNew = false) => {
    if (isNew) {
      setNewTeam({
        ...newTeam,
        leadId: userId
      })
    } else if (editingTeam) {
      setEditingTeam({
        ...editingTeam,
        leadId: userId
      })
    }
  }

  /**
   * Toggles a group assignment for a team
   * Allows adding or removing a group from a team's assigned groups
   * @param team - The team or partial team object being modified
   * @param groupId - The ID of the group to toggle
   * @param isNew - Whether this is for a new team being created
   */
  const toggleTeamGroup = (team: Team | Partial<Team>, groupId: string, isNew = false) => {
    let updatedGroupIds: string[] = []
    
    if (team.groupIds?.includes(groupId)) {
      // Remove the group
      updatedGroupIds = team.groupIds.filter(id => id !== groupId)
    } else {
      // Add the group
      updatedGroupIds = [...(team.groupIds || []), groupId]
    }
    
    if (isNew) {
      setNewTeam({
        ...newTeam,
        groupIds: updatedGroupIds
      })
    } else if (editingTeam) {
      setEditingTeam({
        ...editingTeam,
        groupIds: updatedGroupIds
      })
    }
  }

  /**
   * Gets team lead user object
   * @param leadId - The ID of the user who is the team lead
   * @returns The user object of the team lead, or undefined if the lead ID doesn't match any user
   */
  const getTeamLead = (leadId: string | undefined) => {
    if (!leadId) return undefined
    return users.find(user => user.userId === leadId)
  }

  /**
   * Gets group objects assigned to a team
   * @param groupIds - Array of group IDs assigned to the team
   * @returns Array of group objects that match the provided IDs
   */
  const getTeamGroups = (groupIds: string[] = []) => {
    return groups.filter(group => groupIds.includes(group.groupId))
  }

  /**
   * Gets the total member count across all groups in a team
   * Note: Users may be counted multiple times if they belong to multiple groups
   * @param groupIds - Array of group IDs assigned to the team
   * @returns The total count of members across all groups
   */
  const getTeamMemberCount = (groupIds: string[] = []) => {
    let totalMembers = 0
    
    groupIds.forEach(groupId => {
      totalMembers += users.filter(user => user.groupIds.includes(groupId)).length
    })
    
    return totalMembers
  }

  /**
   * Safely checks if a groupId is included in the team's groupIds array
   * Handles potential undefined values
   */
  const isGroupIncluded = (team: Team | Partial<Team>, groupId: string): boolean => {
    return team.groupIds ? team.groupIds.includes(groupId) : false
  }

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading teams data...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <Layers className="mr-2 h-5 w-5" />
          Team Management
        </h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a team with a lead and assign groups to it.
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
                  value={newTeam.name || ''}
                  onChange={handleNewTeamChange}
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
                  value={newTeam.description || ''}
                  onChange={handleNewTeamChange}
                  className="col-span-3"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="teamLead" className="text-right text-sm font-medium">
                  Team Lead
                </label>
                <Select 
                  value={newTeam.leadId} 
                  onValueChange={(value) => handleLeadChange(value, true)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select team lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No users available
                      </SelectItem>
                    ) : (
                      users.map(user => (
                        <SelectItem key={user.userId} value={user.userId}>
                          {user.name} ({user.role})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="groups">Assigned Groups</Label>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Tags className="mr-2 h-4 w-4" />
                      Select Groups ({newTeam.groupIds?.length || 0})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[200px]">
                    <DropdownMenuLabel>Available Groups</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {groups.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No groups available
                      </div>
                    ) : (
                      groups.map((group) => (
                        <DropdownMenuCheckboxItem
                          key={group.groupId}
                          checked={newTeam.groupIds?.includes(group.groupId)}
                          onCheckedChange={() => toggleTeamGroup(newTeam, group.groupId, true)}
                        >
                          {group.name}
                        </DropdownMenuCheckboxItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="mt-3 p-2 min-h-[70px] border rounded-md bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-2">
                    {newTeam.groupIds?.length 
                      ? `${newTeam.groupIds?.length} groups selected` 
                      : "No groups selected"
                    }
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getTeamGroups(newTeam.groupIds).map(group => (
                      <Badge 
                        key={group.groupId} 
                        variant="secondary"
                        className="px-2 py-1 text-xs flex items-center gap-1"
                      >
                        <span>{group.name}</span>
                        <button 
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleTeamGroup(newTeam, group.groupId, true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                          </svg>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTeam}>
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>List of all teams in the organization</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Team Lead</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No teams found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team) => {
                const teamLead = getTeamLead(team.leadId)
                const teamGroups = getTeamGroups(team.groupIds)
                const memberCount = getTeamMemberCount(team.groupIds)
                
                return (
                  <TableRow key={team.teamId}>
                    <TableCell className="font-medium">
                      {editingTeam?.teamId === team.teamId ? (
                        <div className="space-y-2">
                          <Input
                            name="name"
                            value={editingTeam.name}
                            onChange={handleEditChange}
                            placeholder="Team name"
                          />
                          <Textarea
                            name="description"
                            value={editingTeam.description}
                            onChange={handleEditChange}
                            placeholder="Team description"
                            rows={2}
                          />
                        </div>
                      ) : (
                        <div>
                          <div>{team.name}</div>
                          <div className="text-sm text-muted-foreground max-w-[300px] truncate">
                            {team.description || 'No description'}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTeam?.teamId === team.teamId ? (
                        <Select 
                          value={editingTeam.leadId || ''}
                          onValueChange={handleLeadChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select team lead" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map(user => (
                              <SelectItem key={user.userId} value={user.userId}>
                                {user.name} ({user.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center">
                          <Crown className="h-4 w-4 mr-2 text-amber-500" />
                          <div>
                            <div>{teamLead?.name || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">
                              {teamLead?.title || teamLead?.role || ''}
                            </div>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTeam?.teamId === team.teamId ? (
                        <div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-start">
                                <Tags className="mr-2 h-4 w-4" />
                                Manage Groups ({editingTeam.groupIds.length})
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[200px]">
                              <DropdownMenuLabel>Available Groups</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {groups.map((group) => (
                                <DropdownMenuCheckboxItem
                                  key={group.groupId}
                                  checked={isGroupIncluded(editingTeam, group.groupId)}
                                  onCheckedChange={() => toggleTeamGroup(editingTeam, group.groupId)}
                                >
                                  {group.name}
                                </DropdownMenuCheckboxItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <div className="mt-3 p-2 min-h-[70px] border rounded-md bg-muted/30">
                            <div className="text-xs text-muted-foreground mb-2">
                              {editingTeam.groupIds.length 
                                ? `${editingTeam.groupIds.length} groups selected` 
                                : "No groups selected"
                              }
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {getTeamGroups(editingTeam.groupIds).map(group => (
                                <Badge 
                                  key={group.groupId} 
                                  variant="secondary"
                                  className="px-2 py-1 text-xs flex items-center gap-1"
                                >
                                  <span>{group.name}</span>
                                  <button 
                                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleTeamGroup(editingTeam, group.groupId);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                                    </svg>
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm mb-1">
                            {teamGroups.length} {teamGroups.length === 1 ? 'group' : 'groups'} assigned
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {teamGroups.slice(0, 3).map(group => (
                              <Badge 
                                key={group.groupId} 
                                variant="secondary"
                                className="px-2 py-1 text-xs"
                              >
                                {group.name}
                              </Badge>
                            ))}
                            {teamGroups.length > 3 && (
                              <Badge variant="outline" className="px-2 py-1 text-xs">
                                +{teamGroups.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{memberCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingTeam?.teamId === team.teamId ? (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={saveEditedTeam}
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
                            onClick={() => startEditingTeam(team)}
                            title="Edit team"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTeam(team.teamId)}
                            title="Delete team"
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