'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import ProjectCarousel from '../components/project-carousel';
import ProjectInfo from '../components/project-info';
import BuildingsSection from '../components/building-section';
import { BuildingProps } from '../types/building-props';
import { ProjectProps } from '../types/project-props';

const ProjectDetails = () => {
    const params = useParams();

    const tmpData: ProjectProps = {
        _id: "",
        name: "",
        totalBuilding: 1,
        images: [""],
        state: "",
        city: "",
        area: "",
        address: "",
        description: "",
        clientId: "",
        createdAt: ""
    }

    const [isAddingBuilding, setIsAddingBuilding] = useState(false);
    const [buildings, setBuildings] = useState<BuildingProps[]>([]);
    const [projectId, setProjectId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [project, setProject] = useState<ProjectProps>();

    const projectIdFromParams = params.projectId;

    useEffect(() => {
        const getProjectData = async () => {
            console.log(projectIdFromParams)

        }
        getProjectData();
    }, [loading, projectId])

    const handleAddBuilding =  (building: BuildingProps) => {
        setBuildings(prev => [...prev, building]);
        setIsAddingBuilding(false);
    };

    const handleDeleteBuilding = (index: number) => {
        setBuildings(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="container mx-auto py-8 pb-16 space-y-8">
            <ProjectCarousel images={project?.images} />
            <div className='px-10' >
                <ProjectInfo project={project} />
                <div className="h-10"></div>
                <BuildingsSection
                    project={project}
                    buildings={buildings}
                    onAddBuilding={handleAddBuilding}
                    onDeleteBuilding={handleDeleteBuilding}
                />
            </div>  
        </div>
    );
}

export default ProjectDetails;