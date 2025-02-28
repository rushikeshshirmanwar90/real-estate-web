"use client"

import { AmenitiesProps, Field } from '@/components/types/editable-card';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { OtherSectionProps } from './types';
import { successToast } from '@/components/toasts';
import { addRowHouse } from '@/functions/rowHouse/crud';
import TopHeader from '@/components/TopHeader';
import { EditableSectionCard } from '@/components/editable-cards/editable-info-card';
import { Book, Image } from 'lucide-react';
import AmenitiesSelector from '@/components/editable-cards/AmenitiesSelector';
import { addOtherSection } from '@/functions/otherSection/crud';

const Page = () => {
    const router = useRouter();

    const searchParams = useSearchParams()
    const sectionName = searchParams.get('name') || ""
    const projectId = searchParams.get('projectId') || ""

    const [selectedAmenities, setSelectedAmenities] = useState<AmenitiesProps[]>([]);
    const [formData, setFormData] = useState<OtherSectionProps>({
        projectId: projectId,
        name: sectionName,
        description: "",
        area: 0,
        images: [],
    });

    const basicInfo: Field[] = [
        {
            key: "name",
            label: "Name",
            value: formData.name,
            type: "text"
        },
        {
            key: "description",
            label: "Description",
            value: formData.description,
            type: "textarea"
        },
        {
            key: "area",
            label: "Total Area (in sqft",
            value: formData.area,
            type: "number"
        },
    ]

    const handleImagesChange = (images: string[]) => {
        setFormData((prev) => ({ ...prev, images }))
    }

    const handleInputChange = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const isFormValid = () => {
        return (
            formData.name.trim() !== "" &&
            formData.projectId.trim() !== "" &&
            formData.images.length > 0
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const buildingResult = await addOtherSection(formData);

            if (buildingResult) {
                successToast("Building added and project updated successfully");
                router.push("/projects");
            } else {
                console.error("Failed to add building");
            }
        } catch (error) {
            console.error("Error in form submission:", error);
            console.error("An error occurred while processing your request");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="mx-auto space-y-6 p-6">
                <TopHeader buttonText="Add Other Section" tagTitle="Other Section" title={`set up Other Section`} buttonDisable={!isFormValid()} />
                <div className="flex flex-col justify-between gap-10" >
                    <div>
                        <div className="flex flex-col justify-between gap-10  w-full" >
                            <div className="w-[100%]">
                                <EditableSectionCard
                                    title="Basic Information"
                                    fields={basicInfo}
                                    icon={<Book size={20} color="#073B3A" />}
                                    onFieldChange={handleInputChange}
                                />
                            </div>

                            <div className="w-[100%]" >
                                <EditableSectionCard title="Images" images={formData.images} onImagesChange={handleImagesChange}
                                    icon={<Image size={20} color="#073B3A" />}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default Page
