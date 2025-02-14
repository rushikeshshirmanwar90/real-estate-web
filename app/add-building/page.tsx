"use client"

import { useState } from "react"
import { EditableSectionCard } from "@/components/editable-info-card"
import TopHeader from "@/components/TopHeader"
import { Building, Book } from "lucide-react"

interface FormData {
    images: string[]
    basicInfo: {
        name: string
        description: string
    }
    buildingInfo: {
        name: string
        description: string
        area: number
        totalFlats: number
        Amenities: {
            name: string
            icon: string
        }[]
    }
    sections: {
        name: string
        description: string
        images: string[]
    }[]
    flats: {
        name: string
        description: string
        area: number
        bhk: number
        images: string[]
    }[]
}

export default function BuildingForm() {
    const [formData, setFormData] = useState<FormData>({
        images: [],
        basicInfo: {
            name: "",
            description: "",
        },
        buildingInfo: {
            name: "",
            description: "",
            area: 0,
            totalFlats: 0,
            Amenities: []
        },
        sections: [],
        flats: []
    })

    const handleBasicInfoChange = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, [key]: value },
        }))
    }

    const isFormValid = () => {
        const { basicInfo, buildingInfo } = formData
        return (
            basicInfo.name.trim() !== "" &&
            basicInfo.description.trim() !== "" &&
            buildingInfo.name.trim() !== "" &&
            buildingInfo.description.trim() !== "" &&
            buildingInfo.area > 0 &&
            buildingInfo.totalFlats > 0
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form Data:", formData)
    }

    return (
        <>
            <TopHeader
                buttonText="Save"
                tagTitle="Building"
                title="Setup Building"
                buttonDisable={!isFormValid()}
            />

            <form onSubmit={handleSubmit} className="mx-auto space-y-6 p-6">
                <div className="flex flex-col justify-between gap-10">
                    <div className="flex justify-between w-full">
                        <div className="w-[40%]">
                            <EditableSectionCard
                                title="Basic Information"
                                fields={[
                                    { key: "name", label: "Building Name", value: formData.basicInfo.name, type: "text" },
                                    { key: "description", label: "Description", value: formData.basicInfo.description, type: "textarea" },
                                ]}
                                icon={<Book size={20} color="#073B3A" />}
                                onFieldChange={handleBasicInfoChange}
                            />
                        </div>

                        <div className="w-[55%]">
                            <EditableSectionCard
                                title="Building Information"
                                fields={[
                                    { key: "totalFlats", label: "Total Flats", value: formData.buildingInfo.totalFlats, type: "number" },
                                    { key: "description", label: "Description", value: formData.buildingInfo.description, type: "textarea" },
                                ]}
                                icon={<Building size={20} color="#073B3A" />}
                                onFieldChange={(key, value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        buildingInfo: { ...prev.buildingInfo, [key]: value },
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
