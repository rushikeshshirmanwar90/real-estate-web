import { FormValues } from "@/app/project/schema";
import domain from "@/components/utils/domain";

export const getSingleProject = async (projectId: string) => {
    const res = await fetch(`${domain}/api/project?id=${projectId}`);
    const data = await res.json();
    return data;
}

export const getAllProject = async () => {
    const res = await fetch(`${domain}/api/project`);
    const data = await res.json();
    return data;
}

export const deleteProject = async (projectId: string) => {
    const res = await fetch(`${domain}/api/project?id=${projectId}`, {
        method: "DELETE"
    })
    const data = await res.json();
    return data;
}

export const updateProject = async (updatedData: FormValues, projectId: string) => {
    const res = await fetch(`${domain}/api/project?id=${projectId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
    })
    const data = await res.json();
    return data;
}

export const addProject = async (data: FormValues) => {
    const res = await fetch(`${domain}/api/project`, {
        method: "POST",
        body: JSON.stringify(data),
    })
    const newData = await res.json();
    return newData;
}
