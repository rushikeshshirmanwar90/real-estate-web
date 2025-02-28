"use client"

import { AmenitiesProps, Field } from '@/components/types/editable-card';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { RowHouseProps } from './types';
import { successToast } from '@/components/toasts';
import { addRowHouse } from '@/functions/rowHouse/crud';
import TopHeader from '@/components/TopHeader';
import { EditableSectionCard } from '@/components/editable-cards/editable-info-card';
import { Book, Image } from 'lucide-react';
import AmenitiesSelector from '@/components/editable-cards/AmenitiesSelector';

const Page = () => {
    const router = useRouter();

    const searchParams = useSearchParams()
    const sectionName = searchParams.get('name') || ""
    const projectId = searchParams.get('projectId') || ""

    const [selectedAmenities, setSelectedAmenities] = useState<AmenitiesProps[]>([]);
    const [formData, setFormData] = useState<RowHouseProps>({
        projectId: projectId,
        name: sectionName,
        description: "",
        area: 0,
        totalHouse: 0,
        bookedHouse: 0,
        images: [],
        amenities: [],
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
            key: "totalHouse",
            label: "total number of row houses",
            value: formData.totalHouse,
            type: "number"
        },
        {
            key: "bookedHouse",
            label: "total booked houses",
            value: formData.bookedHouse,
            type: "number"
        },
        {
            key: "area",
            label: "Total Area (in sqft)",
            value: formData.area,
            type: "number"
        },
    ]

    const handleAmenitiesChange = (updatedAmenities: AmenitiesProps[]) => {
        setSelectedAmenities(updatedAmenities);
        setFormData((prevFormData) => ({
            ...prevFormData,
            amenities: updatedAmenities,
        }));
    };

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
            formData.images.length > 0 &&
            (formData.amenities ? formData.amenities.every(amenity => amenity.name.trim() !== "" && amenity.icon.trim() !== "") : true)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const buildingResult = await addRowHouse(formData);

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
                <TopHeader buttonText="Add Row House" tagTitle="Project" title={`set up Row House`} buttonDisable={!isFormValid()} />
                <div className="flex flex-col justify-between gap-10" >
                    <div>
                        <div className="flex justify-between gap-10  w-full" >
                            <div className="w-[50%]">
                                <EditableSectionCard
                                    title="Basic Information"
                                    fields={basicInfo}
                                    icon={<Book size={20} color="#073B3A" />}
                                    onFieldChange={handleInputChange}
                                />
                            </div>

                            <div className="w-[50%]" >
                                <AmenitiesSelector
                                    selectedAmenities={selectedAmenities}
                                    onAmenitiesChange={handleAmenitiesChange}
                                />
                            </div>
                        </div>

                        <div className="mt-5 mb-1" >
                            <EditableSectionCard title="Images" images={formData.images} onImagesChange={handleImagesChange}
                                icon={<Image size={20} color="#073B3A" />}
                            />

                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default Page
