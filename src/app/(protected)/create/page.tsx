'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { create } from "domain";
import { on } from "events";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


type FormInput ={
    repoUrl: string;
    projectName: string;
    githubToken: string;
}

const CreatePage = () => {
    const { register, handleSubmit, reset,formState: { errors } } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();

    function onsubmit(data: FormInput) {
        // window.alert(JSON.stringify(data, null, 2))
        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectName,
            githubToken: data.githubToken,
        },{
        onSuccess: () => {
            toast.success('Project Created Successfully')
            reset()
        },
        onError: () => {
            toast.error('Project Creation Failed')
        }
        })
        return true;
    }
    return(
        <div className="flex item-center gap-12 h-full justify-center">
            <img src="/logo.png" alt="logo" className="h-56 w-auto" />
            <div>
                <div>
                    <h1 className="font-smibold text-2xl">
                        Link Your Github Repository
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the URL of your Repository to link it to VexonAI
                    </p>
                </div>
                <div className="h-4"></div>

                <div>
                    <form action="" onSubmit={handleSubmit(onsubmit)}>
                        <Input
                        {...register('projectName', {required: true})}
                        placeholder="Project Name"
                        required
                        />
                        <div className="h-2"></div>
                        <Input
                        {...register('repoUrl', {required: true})}
                        placeholder="Github Url"
                        type="url"
                        required
                        />
                        <div className="h-2"></div>
                        <Input
                        {...register('githubToken')}
                        placeholder="Github Token (Optional)"
                        />
                        <div className="h-2"></div>
                        <Button type="submit" disabled={createProject.isPending}>
                            Create Project
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePage;