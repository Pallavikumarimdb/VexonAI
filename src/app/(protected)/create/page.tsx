'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";

type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken: string;
};

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();
    const refetch = useRefetch();

    async function onsubmit(data: FormInput) {
        try {
            await createProject.mutateAsync({
                githubUrl: data.repoUrl,
                name: data.projectName,
                githubToken: data.githubToken,
            });
            toast.success('Project Created Successfully');
            await  refetch();
                   reset();
        } catch (error) {
            toast.error('Project Creation Failed');
        }
    }

    return (
        <div className="flex items-center gap-12 pt-[10%] h-full justify-center">    
            <Image src="/img.jpeg" alt="logo" width={300} height={30} priority className="rounded-xl" />
            
            <div>
                <div>
                    <h1 className="font-semibold text-2xl">
                        Link Your Github Repository
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the URL of your Repository to link it to VexonAI
                    </p>
                </div>
                <div className="h-4"></div>

                <div>
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <Input {...register('projectName', { required: true })} placeholder="Project Name" required />
                        <div className="h-2"></div>
                        <Input {...register('repoUrl', { required: true })} placeholder="Github URL" type="url" required />
                        <div className="h-2"></div>
                        <Input {...register('githubToken')} placeholder="Github Token (Optional)" />
                        <div className="h-2"></div>
                        <Button type="submit" disabled={createProject.isPending}>
                            Create Project
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;
