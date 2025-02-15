"use client"
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import axios from "axios"

import TopHeader from '@/components/TopHeader';
import ProjectCard from '@/components/ProjectCard';
import { projectProps } from './types/project-props';

export default function Page() {

    const [projectData, setProjectData] = useState<projectProps[]>([])
    const [isProjectLoading, setIsProjectLoading] = useState<boolean>(false);
    const [handleChange, setHandleChange] = useState<number>();


    const fetchProjectData = async () => {
        setIsProjectLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/api/project");
            const data = res.data;
            setProjectData(data);
        } catch (error) {
            console.error("Error fetching project data:", error);
        } finally {
            setIsProjectLoading(false);
        }
    };

    const refreshData = () => {
        setHandleChange(Math.random());
    };

    useEffect(() => {
        fetchProjectData();
    }, [handleChange]);

    return <div>
        <TopHeader buttonText='Add Project' tagTitle='Featured Properties' title='Our Featured Properties' TagIcon={<Plus />} link="/project-form" />

        <div className='flex flex-col items-center justify-center my-5 gap-5' >
            {
                projectData.map((item: projectProps) => (
                    <ProjectCard projectInfo={item} refreshData={refreshData} />
                ))
            }
        </div>

    </div>

}
