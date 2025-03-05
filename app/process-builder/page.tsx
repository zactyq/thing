import WorkflowBuilder from "@/app/process-builder/workflow-builder"

/**
 * ProcessBuilderPage component serves as the main interface for creating and editing process workflows
 * 
 * This page integrates the WorkflowBuilder component to provide a comprehensive visual workflow design environment.
 * 
 * Features:
 * - Drag and drop interface for creating workflow processes
 * - Visual node connections to define process flow
 * - Support for triggers, conditions, and actions
 * - Property editing for workflow nodes
 * - Consistent viewport height calculations with other builder tools
 * - Responsive design that works across different screen sizes
 */
export default function ProcessBuilderPage() {
  return (
    <main className="h-[calc(100vh-3.5rem)] flex-1">
      <WorkflowBuilder />
    </main>
  )
}

