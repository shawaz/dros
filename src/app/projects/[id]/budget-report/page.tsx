import { redirect } from "next/navigation"
import { getProject } from "@/db/queries"
import { BudgetReportPage } from "@/components/project/report-pages/BudgetReportPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BudgetReportPageRoute({ params }: PageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project?.budgetReport) {
    redirect(`/projects/${id}`)
  }

  return <BudgetReportPage project={project} report={project.budgetReport} />
}
