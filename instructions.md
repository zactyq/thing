# Project Architecture: Interactive Space Builder

## Overview

This application is a comprehensive interactive space builder tool built with Next.js, leveraging React Flow for canvas manipulation and visualization. It allows users to create, visualize, and manage network/physical spaces by placing and connecting various assets on an interactive canvas.

## Technology Stack

- **Frontend Framework**: Next.js 14 (React 18)
- **UI Library**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Canvas Visualization**: React Flow (ReactFlow/XYFlow)
- **State Management**: React hooks (useState, useEffect, useCallback)
- **API Integration**: Structured for RESTful API integration (currently using mock data)
- **Data Persistence**: Local storage for project saving/loading and future Supabase integration

## Project Structure

The project follows a feature-based architecture with clear separation of concerns:

```
app/
├── components/          # Shared application-level components
├── fonts/               # Custom font files
├── space-builder/       # Main space builder feature
│   ├── components/      # Space builder specific components
│   └── page.tsx         # Space builder page
├── dashboard-builder/   # Dashboard builder feature
├── process-builder/     # Process builder feature
├── reference-manager/   # Reference manager feature
├── teams/               # Team management feature
├── globals.css          # Global styles
├── layout.tsx           # Root layout
└── page.tsx             # Homepage
components/
├── ui/                  # Reusable UI components (shadcn/ui)
├── base-node.tsx        # Base node implementation
└── labeled-group-node.tsx # Group node implementation
lib/
├── data/                # Mock data and data utilities
├── services/            # Service layer (API abstraction)
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Core Components

### Space Builder

The central feature of the application is the Space Builder (`app/space-builder/components/space-builder.tsx`), which provides an interactive canvas where users can:

1. Drag and drop assets (network devices, rooms, security equipment, etc.)
2. Create logical groupings of assets
3. Establish connections between assets
4. Configure properties for each asset
5. Save and load space configurations
6. Import and export projects as JSON files

The Space Builder is implemented using React Flow, which provides the core canvas functionality, node management, and connection handling.

### Project Management

The application includes a project management system implemented in `app/space-builder/components/project-manager.tsx` that provides:

1. **Project Saving**: Save projects to localStorage with metadata (name, description)
2. **Project Loading**: Load projects from localStorage
3. **Project Export**: Export projects as JSON files for backup or sharing
4. **Project Import**: Import projects from JSON files
5. **Project Listing**: View and manage all saved projects

This allows users to maintain their work across sessions without requiring backend integration.

### Service Layer

The application includes a service layer (`lib/services/space-builder-service.ts`) that abstracts data operations from the UI components. It provides:

1. **API Abstraction**: Currently using mock data but structured to easily switch to API calls 
2. **Local Storage Integration**: Manages project persistence using the browser's localStorage API
3. **Import/Export**: Handles file-based import and export functionality

Key service functions include:

- `getAssetTypes()`: Retrieves available asset types
- `getCanvasState()`: Loads a saved canvas state from localStorage or mock data
- `saveCanvasState()`: Persists the current canvas state to localStorage
- `getProjectsList()`: Retrieves the list of saved projects with metadata
- `deleteProject()`: Removes a project from localStorage
- `exportProject()`: Exports a project as a downloadable JSON file
- `importProject()`: Imports a project from a JSON file

### Type System

The application has a well-defined type system (`lib/types/space-builder.ts`) that ensures consistency across components:

- `AssetType`: Defines categories of assets that can be placed in the space
- `NodeData`: Extends React Flow's node data with application-specific properties
- `CanvasState`: Represents the complete state of a space, including nodes and connections
- `ProjectMetadata`: Contains information about saved projects (name, dates, etc.)
- Service response types for API integration

## Data Flow

1. **User Interaction**: The user interacts with the canvas (adding nodes, creating connections)
2. **State Updates**: React Flow state is updated via hooks (`useNodesState`, `useEdgesState`)
3. **Service Layer**: Changes are passed to the service layer
4. **Persistence**: The service layer handles persistence to localStorage (and future API calls)
5. **Response Handling**: Responses update the UI state accordingly

## Component Interaction

1. **Space Builder**: Main container component that orchestrates the canvas and sidebars
2. **Project Manager**: Handles project saving, loading, import and export operations
3. **Left Sidebar**: Provides a palette of available asset types to add to the canvas
4. **Right Sidebar**: Displays and allows editing of properties for the selected node
5. **Floating Palette**: Provides quick access to commonly used actions
6. **Asset Nodes**: Represent individual assets on the canvas
7. **Group Nodes**: Provide logical grouping of assets with containment functionality

## Implementation Details

### Node Management

The application handles two primary node types:
- **Asset Nodes**: Represent individual assets/devices
- **Group Nodes**: Provide logical grouping with containment capabilities

Custom node implementations extend React Flow's base node functionality with application-specific features:
- `base-node.tsx`: Basic implementation shared by all nodes
- `labeled-group-node.tsx`: Enhanced implementation for group nodes with sizing handles

### Connection Handling

Connections between nodes are managed by React Flow's edge system, with custom styling and validation rules applied.

### State Persistence

The application uses a multi-level persistence strategy:
1. In-memory state is managed via React Flow hooks for immediate UI updates
2. Auto-saving to localStorage occurs after a debounce period (2 seconds of inactivity)
3. Manual saving is available through the Project Manager UI
4. Import/export functionality allows for project backup and transfer between devices
5. Future API integration is prepared through the service layer abstraction

## Local Storage Implementation

The application uses the browser's localStorage API to persist projects:

1. **Storage Format**:
   - Projects list: `space_builder_projects` key stores an array of project metadata
   - Individual projects: `space_builder_project_[id]` keys store the canvas state for each project

2. **Auto-Loading**:
   - On application start, the most recently modified project is automatically loaded
   - If no projects exist, a default project is created from mock data

3. **Metadata Tracking**:
   - Each project stores metadata including name, description, creation date, and last modified date
   - This enables efficient listing and sorting without loading the full project state

4. **File Operations**:
   - Export creates a JSON file combining project metadata and state
   - Import parses this format and adds the project to localStorage with a new ID

## Future Extensibility

The architecture allows for easy extension:
1. New asset types can be added with minimal changes
2. Additional canvas features can be implemented by extending React Flow
3. API integration is prepared through the service layer
4. Authentication and multi-user functionality can be added through the planned Supabase integration

## Performance Considerations

1. Canvas rendering is optimized through React Flow's built-in optimizations
2. Component re-renders are minimized with React's useCallback and useMemo hooks
3. Saving to localStorage is debounced to prevent performance issues during rapid changes
4. The application is structured to handle larger spaces with many nodes efficiently

## Integration Points

The application is designed to integrate with:
1. Backend API services via the service layer
2. Authentication providers through Supabase
3. Custom asset type registries
4. External data sources for asset information

This architecture provides a solid foundation for a powerful and extensible space building application.
