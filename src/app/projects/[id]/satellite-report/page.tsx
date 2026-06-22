import { redirect } from "next/navigation"
import { getProject } from "@/db/queries"
import { SatelliteReportPage } from "@/components/project/report-pages/SatelliteReportPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SatelliteReportPageRoute({ params }: PageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project?.satelliteReport) {
    redirect(`/projects/${id}`)
  }

  return <SatelliteReportPage project={project} report={project.satelliteReport} />
}
