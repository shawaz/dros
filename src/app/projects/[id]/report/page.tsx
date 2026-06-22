import { redirect } from "next/navigation"
import { getProject } from "@/db/queries"
import { RehabReportPage } from "@/components/project/report-pages/RehabReportPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RehabReportPageRoute({ params }: PageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project?.rehabReport) {
    redirect(`/projects/${id}`)
  }

  return <RehabReportPage project={project} report={project.rehabReport} />
}
