"use client"
import { useState } from "react"
import type { FormData } from "./types"
import { EditableSectionCard } from "@/components/editable-info-card"
import TopHeader from "@/components/TopHeader"
import { Book, Image, MapPinCheck } from "lucide-react"
import { Field } from "@/components/types/editable-card"
import { Label } from "recharts"
import AmenitiesSelector from "@/components/AmenitiesSelector"


export default function MultiSectionForm() {

    const [selectedAmenities, setSelectedAmenities] = useState([
    ]);

    const [formData, setFormData] = useState<FormData>({
        images: [],
        basicInfo: {
            name: "",
            description: "",
            ProjectType: "",
            area: 0
        },
        address: {
            streetAddress: "",
            area: "",
            state: "",
            city: "",
        },
    })

    const handleImagesChange = (images: string[]) => {
        setFormData((prev) => ({ ...prev, images }))
    }

    const handleBasicInfoChange = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, [key]: value },
        }))
    }

    const handleAddressChange = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, [key]: value },
        }))
    }

    const isFormValid = () => {
        const { basicInfo, address } = formData
        return (
            basicInfo.name.trim() !== "" &&
            basicInfo.description.trim() !== "" &&
            address.streetAddress.trim() !== "" &&
            address.area.trim() !== "" &&
            address.state.trim() !== "" &&
            address.city.trim() !== ""
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form Data:", formData)
    }

    const handleAmenitiesChange = (updatedAmenities: any) => {
        setSelectedAmenities(updatedAmenities);
    };

    const basicInfoFields: Field[] = [
        {
            key: "name",
            label: "Name",
            value: formData.basicInfo.name,
            type: "text"
        },
        {
            key: "description",
            label: "Description",
            value: formData.basicInfo.description,
            type: "textarea"
        },
        {
            key: "area",
            label: "Total area (in sqft)",
            value: formData.basicInfo.area,
            type: "number"
        },
        {
            key: "ProjectType",
            label: "project type",
            type: "select",
            value: formData.basicInfo.ProjectType,
            options: [
                {
                    label: "upcoming project",
                    value: "upcoming"
                },
                {
                    label: "onGoing project",
                    value: "ongoing"
                },
                {
                    label: "completed project",
                    value: "completed"
                },
            ]
        }
    ]

    const addressInfoFields: Field[] =
        [
            {
                key: "streetAddress",
                label: "Street Address",
                value: formData.address.streetAddress,
                type: "text"
            },

            {
                key: "area",
                label: "Area",
                value: formData.address.area,
                type: "text"
            },

            {
                key: "state",
                label: "State",
                value: formData.address.state,
                type: "text"
            },
            {
                key: "city",
                label: "City",
                value: formData.address.city,
                type: "text"
            },
        ]

    return (
        <>
            <TopHeader buttonText="Save" tagTitle="Project" title="Setup project" buttonDisable={!isFormValid()} />
            <form onSubmit={handleSubmit} className="mx-auto space-y-6 p-6">
                <div className="flex flex-col justify-between gap-10" >
                    <div className="flex justify-between gap-10  w-full" >
                        <div className="w-[50%]" >
                            <EditableSectionCard
                                title="Basic Information"
                                fields={basicInfoFields}

                                icon={<Book size={20} color="#073B3A" />}

                                onFieldChange={handleBasicInfoChange}
                            />
                        </div>

                        <div className="w-[50%]" >
                            <EditableSectionCard
                                title="Address Information"
                                fields={addressInfoFields}
                                onFieldChange={handleAddressChange}
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