import Link from "next/link"
import { getProject } from "@/db/queries"
import { ProjectDetail } from "@/components/project/ProjectDetail"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-24">
        <p className="text-sm text-muted-custom">Project not found.</p>
        <Link
          href="/?tab=projects"
          className="text-sm text-green-custom font-semibold hover:underline cursor-pointer"
        >
          ← Back to Projects
        </Link>
      </div>
    )
  }

  return <ProjectDetail project={project} />
}
