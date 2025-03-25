import { api } from "@/trpc/react";
import React from "react";
import {useLocalStorage} from "usehooks-ts";

const useProject = () => {
    const {data: projects} = api.project.getProjects.useQuery();
    const [projectId, setProjectsId] = useLocalStorage('projects', "");
    const project = projects?.find(project => project.id === projectId);
    return{
        projects,
        project,
        projectId,
        setProjectsId
    }
}

export default useProject;