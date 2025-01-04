import domain from "@/components/utils/domain";
import { BuildingProps } from "../types/building-props";

export const postBuilding = async (formData: BuildingProps) => {
    const res = await fetch(`${domain}/api/building?id=${formData.projectId}`, {
        method: 'POST',
        body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
}

export const getBuildings = async (projectId: string) => {
    const res = await fetch(`${domain}/api/building?projectId=${projectId}`);
    const data = await res.json();

    return data;
}