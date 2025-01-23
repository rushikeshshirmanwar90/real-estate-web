"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

import type { FormData } from "./types"
import { EditableSectionCard } from "@/components/editable-info-card"
import TopHeader from "@/components/TopHeader"

export default function MultiSectionForm() {
    const [formData, setFormData] = useState<FormData>({
        images: [],
        basicInfo: {
            name: "",
            description: "",
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

    const handleBasicInfoChange = (key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, [key]: value },
        }))
    }

    const handleAddressChange = (key: string, value: string) => {
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

    return (
        <>

            <TopHeader buttonText="Save" tagTitle="Project" title="Setup project" buttonDisable={!isFormValid()} />

            <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6 p-6">
                <EditableSectionCard title="Images" images={formData.images} onImagesChange={handleImagesChange} />

                <EditableSectionCard
                    title="Basic Information"
                    fields={[
                        { key: "name", label: "Name", value: formData.basicInfo.name, type: "text" },
                        { key: "description", label: "Description", value: formData.basicInfo.description, type: "textarea" },
                    ]}
                    onFieldChange={handleBasicInfoChange}
                />

                <EditableSectionCard
                    title="Address Information"
                    fields={[
                        { key: "streetAddress", label: "Street Address", value: formData.address.streetAddress, type: "text" },
                        { key: "area", label: "Area", value: formData.address.area, type: "text" },
                        { key: "state", label: "State", value: formData.address.state, type: "text" },
                        { key: "city", label: "City", value: formData.address.city, type: "text" },
                    ]}
                    onFieldChange={handleAddressChange}
                />

            </form>
        </>
    )
}

