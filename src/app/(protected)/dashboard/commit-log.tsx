'use client'
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

const CommitLog = () => {
    const { projectId, project } = useProject();
    
    // Check if user is project creator
    const { data: isCreator, isLoading: isCreatorLoading } = api.project.isProjectCreator.useQuery(
        { projectId },
        { 
            enabled: !!projectId,
            // Don't retry too much to avoid excessive requests
            retry: 1
        }
    );
    
    // Only fetch commits if user is the creator
    const { data: commits, isLoading: commitsLoading } = api.project.getCommits.useQuery(
        { projectId },
        { 
            enabled: !!projectId && isCreator === true,
        }
    );
    
    // Show loading state
    if (isCreatorLoading || (isCreator && commitsLoading)) {
        return (
            <div className="p-4 text-center">
                <p className="text-gray-600">Loading commit history...</p>
            </div>
        );
    }
    
    // If not creator, show restricted message
    if (isCreator === false) {
        return (
            <div className="p-4 text-center rounded-md bg-gray-100">
                <p className="text-gray-600">No commits found for this User.</p>
            </div>
        );
    }
    
    // Show empty state if no commits
    if (!commits || commits.length === 0) {
        return (
            <div className="p-4 text-center rounded-md bg-gray-100">
                <p className="text-gray-600">No commits found for this project.</p>
            </div>
        );
    }

    return (
        <>
            <ul className="space-y-6">
                {commits.map((commit, commitIdx) => {
                    return (
                        <li key={commit.id} className="relative flex gap-x-4">
                            <div className={cn(
                                commitIdx === commits.length - 1 ? 'h-8' : '-bottom-6',
                                'absolute left-0 top-0 flex w-6 justify-center'
                            )}>
                                <div className="w-px translate-x-1 bg-gray-200"></div>
                            </div>
                            <>
                                <img src={commit.commitAuthorAvatar} alt="avatar" className="relative mt-4 size-8 flex-none rounded-full bg-gray-500" />
                                <div className="flex-auto rounded-md bg-[#d0c8f9] p-3 ring-inset ring-gray-200">
                                    <div className="flex justify-between gap-x-4">
                                        <Link target="_blank" href={`${project?.githubUrl}/commits/${commit.commitHash}`} className="py-0.5 text-xs leading-5 text-gray-500">
                                            <span className="font-medium text-slate-600">
                                                {commit.commitAuthorName}
                                            </span>{" "}
                                            <span className="inline-flex items-center text-slate-600">
                                                committed
                                                <ExternalLink className="ml-1 size-4" />
                                            </span>
                                        </Link>
                                        <span className="text-xs text-slate-500">
                                            {new Date(commit.commitDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="font-semibold">
                                        {commit.commitMessage}
                                    </span>
                                    <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                                        {commit.summary}
                                    </pre>
                                </div>
                            </>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default CommitLog;