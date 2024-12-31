'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ProjectCarousel from '../components/project-carousel';
import ProjectInfo from '../components/project-info';
import BuildingsSection from '../components/building-section';
import { BuildingProps } from '../types/building-props';
import { ProjectProps } from '../types/project-props';
import domain from '@/components/utils/domain';

const ProjectDetails = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    let projectId: string = "";
    let mode: string | null = "";

    if (params) {
        projectId = String(params.id);
        mode = searchParams.get("mode");
    }

    console.log(mode);
    const [isAddingBuilding, setIsAddingBuilding] = useState(false);
    const [buildings, setBuildings] = useState<BuildingProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [project, setProject] = useState<ProjectProps>();

    useEffect(() => {
        const getProjectData = async () => {
            const res = await fetch(`${domain}/api/project?id=${projectId}`);
            const data = await res.json();
            setProject(data);
            setLoading(false);
        }
        getProjectData();
    }, [loading, projectId])

    const handleAddBuilding = async (building: BuildingProps) => {
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