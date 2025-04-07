"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image";
import { Github, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RepoDetails } from "./repo-details"
import { Octokit } from "octokit"
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { toast } from "sonner";


type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken: string;
};



export default function CreateProjectForm() {
    const [projectName, setProjectName] = useState("")
    const [repoUrl, setRepoUrl] = useState("")
    const createProject = api.project.createProject.useMutation();
    const { reset } = useForm<FormInput>();
    const refetch = useRefetch();
    const [isLoading, setIsLoading] = useState(false)
    const [repoFetched, setRepoFetched] = useState(false)
    const [requiresToken, setRequiresToken] = useState(false)
    const [githubToken, setGithubToken] = useState("")
    const [repoDetails, setRepoDetails] = useState<{
        name: string
        size: string
        sizeCategory: string
        branches: string[]
    } | null>(null)


    const validateAndFetchRepo = async () => {
        if (!repoUrl.includes("github.com/")) return

        setIsLoading(true)

        try {
            const octokit = new Octokit({
                auth: "",
            })

            const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/")

            if (!owner || !repo) {
                throw new Error("Invalid GitHub repository URL")
            }

            const { data: repoData } = await octokit.rest.repos.get({
                owner,
                repo,
            })

            const { data: branchesData } = await octokit.rest.repos.listBranches({
                owner,
                repo,
            })


            const sizeInMB = (repoData.size / 1024).toFixed(2) + " MB"
            const sizeCategory =
                repoData.size < 1000 ? "Small" : repoData.size < 5000 ? "Medium" : "Large"

            setRepoDetails({
                name: `${owner}/${repo}`,
                size: sizeInMB,
                sizeCategory,
                branches: branchesData.map((b) => b.name),
            })

            console.log(name+"  "+sizeInMB+"  "+branchesData.map((b) => b.name)+"  "+branchesData)

            setRequiresToken(repoData.size > 1000)
            setRepoFetched(true)
        } catch (error) {
            console.error("Failed to fetch repo:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRepoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepoUrl(e.target.value)
        setRepoFetched(false)
    }

    const handleSubmit = async function (e: React.FormEvent) {
        e.preventDefault()
        await validateAndFetchRepo()

        if (requiresToken) {
          if (!githubToken) {
            toast.error("GitHub Token is required to proceed.")
            return
          }
        }
        try {
            await createProject.mutateAsync({
                githubUrl: repoUrl,
                name: projectName,
                githubToken: githubToken,
            });
            toast.success('Project Created Successfully');
            await  refetch();
                   reset();
        } catch (error) {
            toast.error('Project Creation Failed');
        }
    }


    return (
        <Card className=" w-full bg-transparent border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
                <CardDescription>Set up a new project for AI code summarization and embedding</CardDescription>
            </CardHeader>

            <div className="flex items-center gap-12 px-[6%] pt-10 h-full justify-cente">
                <Image src="/img.jpeg" alt="logo" width={300} height={30} priority className="rounded-xl" />

                <form onSubmit={handleSubmit} className="bg-white w-full rounded-xl shadow-lg py-8 px-4">
                    <CardContent className="space-y-6">
                        {/* Project Name Input */}
                        <div className="space-y-2">
                            <Label htmlFor="project-name">Project Name</Label>
                            <Input
                                id="project-name"
                                placeholder="My Awesome Project"
                                maxLength={50}
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                            <p className="text-xs text-zinc-500">Give your project a memorable name</p>
                            <div className="text-xs text-right text-zinc-400">{projectName.length}/50</div>
                        </div>

                        {/* GitHub Repository URL */}
                        <div className="space-y-2">
                            <Label htmlFor="repo-url">GitHub Repository URL</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Github className="h-4 w-4 text-zinc-500" />
                                </div>
                                <Input
                                    id="repo-url"
                                    className="pl-10"
                                    placeholder="https://github.com/username/repository"
                                    value={repoUrl}
                                    onChange={handleRepoUrlChange}
                                    onBlur={validateAndFetchRepo}
                                    required
                                />
                                {isLoading && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent"></div>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-zinc-500">Paste your public or private GitHub repo URL</p>
                        </div>

                        {/* Repository Details (shown after fetching) */}
                        {repoFetched && repoDetails && (
                            <RepoDetails requiresToken={requiresToken} repoDetails={repoDetails} />
                        )}

                        {/* GitHub Token Input (conditional) */}
                        {repoFetched && requiresToken && (
                            <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-amber-800">This repository is large or private</h4>
                                        <p className="text-sm text-amber-700 mt-1">
                                            Please provide a GitHub Token to proceed. Your token is securely used only for API calls.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <Label htmlFor="github-token">GitHub Token</Label>
                                    <Input
                                        id="github-token"
                                        type="password"
                                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                        value={githubToken}
                                        onChange={(e) => setGithubToken(e.target.value)}
                                        className="mt-1"
                                        required={requiresToken}
                                    />
                                </div>

                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-amber-700"
                                    type="button"
                                    onClick={() => window.open("https://github.com/settings/tokens/new", "_blank")}
                                >
                                    Learn how to create a GitHub Token
                                </Button>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col pt-4 items-start space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                        <div className="text-sm text-zinc-500">Estimated load time: ~2 minutes based on repo size</div>

                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                            <Button variant="link" type="button">
                                What happens next?
                            </Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading || !repoUrl}>
                            {isLoading ? "Fetching Repo..." : "Create Project"}
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </div>
        </Card>
    )
}







