"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Book, Image, MapPinCheck } from "lucide-react"

import TopHeader from "@/components/TopHeader"
import AmenitiesSelector from "@/components/editable-cards/AmenitiesSelector"
import { EditableSectionCard } from "@/components/editable-cards/editable-info-card"

import { AmenitiesProps, Field } from "@/components/types/editable-card"

import { addProject, updateProject } from "@/functions/project/crud"
import { getClientId } from "@/functions/getClientId"
import { successToast } from "@/components/toasts"
import { BuildingFormProps } from "./types"


const Page = () => {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedAmenities, setSelectedAmenities] = useState<AmenitiesProps[]>([]);
    const [formData, setFormData] = useState<BuildingFormProps>({
        images: [],
        area: 0,
        name: "",
        projectId: "",
        description: "",
        amenities: [],
        flatInfo: [],
        section: []
    });

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
            (formData.section ? formData.section.every(sec => sec.name.trim() !== "") : true) &&
            (formData.flatInfo ? formData.flatInfo.every(flat =>
                flat.title.trim() !== "" &&
                flat.images.length > 0 &&
                flat.totalFlats > 0 &&
                flat.totalBookedFlats >= 0 &&
                flat.totalArea > 0
            ) : true) &&
            (formData.amenities ? formData.amenities.every(amenity => amenity.name.trim() !== "" && amenity.icon.trim() !== "") : true)
        );
    };

    const handleAmenitiesChange = (updatedAmenities: AmenitiesProps[]) => {
        setSelectedAmenities(updatedAmenities);
        setFormData((prevFormData) => ({
            ...prevFormData,
            amenities: updatedAmenities,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData)
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="mx-auto space-y-6 p-6">
                <TopHeader buttonText={`${projectId ? "Update Project" : "Add Project"}`} tagTitle="Project" title={`${projectId ? "Update The project" : "Set up project"}`} buttonDisable={!isFormValid()} />
                <div className="flex flex-col justify-between gap-10" >
                    <div className="flex justify-between gap-10  w-full" >
                        <div className="w-[50%]">
                            <EditableSectionCard
                                title="Basic Information"
                                fields={basicInfoFields}
                                icon={<Book size={20} color="#073B3A" />}
                                onFieldChange={handleInputChange}
                            />
                        </div>

                        <div className="w-[50%]" >
                            <EditableSectionCard
                                title="Address Information"
                                fields={addressInfoFields}
                                onFieldChange={handleInputChange}
                                icon={<MapPinCheck size={20} color="#073B3A" />}
                            />
                        </div>
                    </div>
                    <div className="flex items-center  justify-between w-full" >
                        <div className="w-[48%] m-auto" >
                            <EditableSectionCard title="Images" images={formData.images} onImagesChange={handleImagesChange}
                                icon={<Image size={20} color="#073B3A" />}
                            />
                        </div>
                        <div className="w-[48%] m-auto" >
                            <AmenitiesSelector
                                selectedAmenities={selectedAmenities}
                                onAmenitiesChange={handleAmenitiesChange}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Page