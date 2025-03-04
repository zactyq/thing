import WorkflowBuilder from "@/components/workflow-builder"

/**
 * WorkflowBuilderPage component serves as the route page for the workflow builder tool
 * Features:
 * - Maintains consistent viewport height calculations with other builder tools
 * - Directly renders the WorkflowBuilder component as the main content
 * - Height calculation matches the space-builder page exactly
 * - Uses the shared Header component from the root layout
 */
export default function WorkflowBuilderPage() {
  return (
    <main className="h-[calc(100vh-3.5rem)] flex-1">
      <WorkflowBuilder />
    </main>
  )
}

