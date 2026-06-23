import { redirect } from "next/navigation"
import { getProject } from "@/db/queries"
import { FieldExecutionReportPage } from "@/components/project/report-pages/FieldExecutionReportPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function FieldExecutionReportPageRoute({ params }: PageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project?.fieldExecutionReport) {
    redirect(`/projects/${id}`)
  }

  return <FieldExecutionReportPage project={project} report={project.fieldExecutionReport} />
}
