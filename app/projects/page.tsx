"use client"
import { Plus } from 'lucide-react';
import TopHeader from '@/components/TopHeader';
import ProjectCard from '@/components/ProjectCard';

export default function Page() {

    return <div>
        <TopHeader buttonText='Add Project' tagTitle='Featured Properties' title='Our Featured Properties' TagIcon={<Plus />} link="/project-form" />

        <div className='flex items-center justify-center mt-4' >
            <ProjectCard />
        </div>

    </div>

}
