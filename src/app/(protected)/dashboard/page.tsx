'use client'
import useProject from "@/hooks/use-project";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React from "react"
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import DeleteProjectButton from "./delete-project-button";

const DashboardPage = () => {
  const { project } = useProject();
  console.log("check" + project?.githubUrl)
  return (
   <div className="p-4">
  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
    {/* GitHub Info Block */}
    <div className="w-full sm:w-fit rounded-md bg-primary px-4 py-2">
      <div className="flex items-center flex-wrap gap-2">
        <Github className="size-4 text-white" />
        <p className="text-sm font-medium text-white">
          This Project is linked to{" "}
          <Link
            href={project?.githubUrl ?? ""}
            className="inline-flex items-center text-white/80 hover:underline break-all"
          >
            {project?.githubUrl}
            <ExternalLink className="size-4 ml-1 text-white/80" />
          </Link>
        </p>
      </div>
    </div>

    {/* Delete Button */}
    {project?.id && (
      <div className="w-full sm:w-auto">
        <DeleteProjectButton projectId={project.id} />
      </div>
    )}
  </div>

  {/* Cards Section */}
  <div className="my-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <AskQuestionCard />
      {/* Other cards like <MeetingCard /> can be added here */}
    </div>
  </div>

  {/* Commit Log Section */}
  <div className="mt-8">
    <CommitLog />
  </div>
</div>

  )
}

export default DashboardPage;