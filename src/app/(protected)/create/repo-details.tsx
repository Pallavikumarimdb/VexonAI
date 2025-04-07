"use client"

import { useState } from "react"
import { FileCode, GitBranch } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RepoDetailsProps {
    repoDetails: {
      name: string
      size: string
      sizeCategory: string
      branches: string[]
    }
    requiresToken?: boolean
  }

  

export function RepoDetails({ repoDetails, requiresToken = false }: RepoDetailsProps) {
  // Mock data - in a real app, this would come from API
  const [repoDetail] = useState({
    name: repoDetails.name,
    size: repoDetails.size,
    sizeCategory: repoDetails.sizeCategory,
    branches: repoDetails.branches,
  })

  return (
    <div className="rounded-md border p-4 space-y-3">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <FileCode className="h-4 w-4 text-emerald-600" />
        Repository Details
      </h3>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-500">Repository:</span>
            <span className="text-sm font-mono">{repoDetail.name}</span>
          </div>

          <Badge variant={requiresToken ? "destructive" : "outline"} className="w-fit">
            {repoDetail.sizeCategory} ({repoDetail.size})
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-500">Branch:</span>

          <Select defaultValue={repoDetail.branches[0]}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {repoDetail.branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

