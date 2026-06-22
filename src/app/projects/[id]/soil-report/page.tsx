import { redirect } from "next/navigation"
import { getProject } from "@/db/queries"
import { SoilReportPage } from "@/components/project/report-pages/SoilReportPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SoilReportPageRoute({ params }: PageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project?.soilReport) {
    redirect(`/projects/${id}`)
  }

  return <SoilReportPage project={project} report={project.soilReport} />
}
