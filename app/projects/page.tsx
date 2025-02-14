"use client"
import { Plus } from 'lucide-react';
import TopHeader from '@/components/TopHeader';

export default function Page() {

    return <div>
        <TopHeader buttonText='Add Project' tagTitle='Featured Properties' title='Our Featured Properties' TagIcon={<Plus />} link="/project-form" />
    </div>

}
