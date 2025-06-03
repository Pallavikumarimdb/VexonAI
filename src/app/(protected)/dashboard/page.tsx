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
    <div className="">
      {/* {project?.id} */}
      <div className="flex flex-center justify-between flex-wrap gap-y-4">
        <div className="w-fit rounded-md bg-primary px-4 py-2">
          <div className="flex items-center">
          <Github className="size-4 text-white" />
          <div className="ml-2">
            <p className="text-sm font-small text-white">
              This Project is linked to {' '}
              <Link href={project?.githubUrl ?? ''} className="inline-flex item-center text-white/80 hover:underline">
                {project?.githubUrl}
                <ExternalLink className="size-4 ml-1 text-white/80 hover:underline" />
              </Link>
            </p>
          </div>
          </div>
        </div>
        {project?.id && <DeleteProjectButton projectId={project.id} />}
      </div>

      <div className="my-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <AskQuestionCard/>
          {/* MeetingCard */}
        </div>
      </div>

      <div className="mt-8">
        <CommitLog/>
      </div>
    </div>
  )
}

export default DashboardPage;