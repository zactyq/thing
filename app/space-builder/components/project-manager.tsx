"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Save, 
  FolderOpen, 
  Download, 
  Upload, 
  Trash2,
  Plus,
  FileJson
} from "lucide-react"
import { SpaceBuilderService } from "@/lib/services/space-builder-service"
import type { ProjectMetadata, CanvasState } from "@/lib/types/space-builder"

// Initialize service
const spaceBuilderService = new SpaceBuilderService()

interface ProjectManagerProps {
  /**
   * Current project ID
   */
  currentProjectId: string;
  
  /**
   * Current canvas state
   */
  canvasState: CanvasState;
  
  /**
   * Called when a project is loaded
   */
  onLoadProject: (projectId: string) => void;
  
  /**
   * Called when a new project is created
   */
  onNewProject: () => void;
}

/**
 * ProjectManager component provides a UI for managing projects:
 * - Save current project
 * - Open existing projects
 * - Create new projects
 * - Import/export projects as JSON files
 * - Delete projects
 * 
 * This component integrates with the SpaceBuilderService to persist projects
 * to localStorage, allowing users to maintain their work across sessions without
 * requiring backend integration.
 */
export function ProjectManager({ 
  currentProjectId, 
  canvasState, 
  onLoadProject,
  onNewProject
}: ProjectManagerProps) {
  // Track all available projects
  const [projects, setProjects] = useState<ProjectMetadata[]>([])
  
  // Track the current project's metadata
  const [currentProject, setCurrentProject] = useState<ProjectMetadata | null>(null)
  
  // Manage file import dialog
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Fields for save dialog
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  
  // Load the list of projects on component mount
  useEffect(() => {
    refreshProjectsList()
  }, [])
  
  // Update project fields when currentProjectId changes
  useEffect(() => {
    const currentProject = projects.find(p => p.id === currentProjectId) || null
    setCurrentProject(currentProject)
    setProjectName(currentProject?.name || "")
    setProjectDescription(currentProject?.description || "")
  }, [currentProjectId, projects])
  
  /**
   * Refresh the list of projects from localStorage
   */
  const refreshProjectsList = () => {
    const projectsList = spaceBuilderService.getProjectsList()
    setProjects(projectsList)
  }
  
  /**
   * Save the current project with updated metadata
   */
  const saveProject = () => {
    spaceBuilderService.saveCanvasState(currentProjectId, canvasState, {
      name: projectName,
      description: projectDescription
    })
    refreshProjectsList()
  }
  
  /**
   * Create a new project
   */
  const createNewProject = () => {
    onNewProject()
  }
  
  /**
   * Delete the specified project
   */
  const deleteProject = (projectId: string) => {
    if (window.confirm(`Are you sure you want to delete "${projects.find(p => p.id === projectId)?.name}"?`)) {
      spaceBuilderService.deleteProject(projectId)
      refreshProjectsList()
      
      // If we deleted the current project, create a new one
      if (projectId === currentProjectId) {
        onNewProject()
      }
    }
  }
  
  /**
   * Export the current project as a JSON file
   */
  const exportProject = () => {
    spaceBuilderService.exportProject(currentProjectId)
  }
  
  /**
   * Trigger file input click for importing a project
   */
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  /**
   * Handle file selection for import
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      alert("Please select a JSON file")
      return
    }
    
    setIsImporting(true)
    
    try {
      const projectId = await spaceBuilderService.importProject(file)
      if (projectId) {
        refreshProjectsList()
        onLoadProject(projectId)
      }
    } catch (error) {
      console.error("Failed to import project:", error)
      alert("Failed to import project: " + (error as Error).message)
    } finally {
      setIsImporting(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }
  
  /**
   * Format a date string for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }
  
  return (
    <div className="flex items-center space-x-2">
      {/* Save Project Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" title="Save Project">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input 
                id="project-name" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)} 
                placeholder="My Space Layout"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description (Optional)</Label>
              <Textarea 
                id="project-description" 
                value={projectDescription} 
                onChange={(e) => setProjectDescription(e.target.value)} 
                placeholder="Brief description of this project"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={saveProject}>Save Project</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Open Project Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" title="Open Project">
            <FolderOpen className="h-4 w-4 mr-2" />
            Open
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Open Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-auto">
            {projects.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                No saved projects found
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div 
                    key={project.id} 
                    className={`p-3 border rounded-md flex justify-between items-center ${
                      project.id === currentProjectId ? 'bg-muted border-primary' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{project.name}</div>
                      {project.description && (
                        <div className="text-sm text-gray-500 truncate max-w-sm">
                          {project.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Last modified: {formatDate(project.lastModified)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <DialogClose asChild>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => onLoadProject(project.id)}
                          disabled={project.id === currentProjectId}
                        >
                          Open
                        </Button>
                      </DialogClose>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={createNewProject}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={triggerFileInput} disabled={isImporting}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json,application/json"
                className="hidden"
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Button */}
      <Button variant="outline" size="sm" onClick={exportProject} title="Export Project">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      
      {/* Project Info */}
      {currentProject && (
        <div className="ml-4 text-sm">
          <span className="font-medium">{currentProject.name}</span>
          <span className="text-gray-500 text-xs ml-2">
            Last saved: {formatDate(currentProject.lastModified)}
          </span>
        </div>
      )}
    </div>
  )
} 