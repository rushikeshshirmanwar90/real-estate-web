"use client"
import { useEffect, useState } from 'react'
import ProjectGrid from './components/project-gride'
import { ProjectProps } from './types/project-props'

export default function Page() {
    const [projects, setProjects] = useState<ProjectProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getProjectsData = async () => {
            const res = await fetch(`http://localhost:3000/api/project`);
            const data = await res.json();
            console.table(data);
            setProjects(data);
            setLoading(false);
        }

        getProjectsData();
    }, [loading])

    return <ProjectGrid projects={projects} />
}