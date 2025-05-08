"use client"
import { HeroSectionEditableCard } from '@/components/homepage/forms/HeroEditCard';
import TopHeader from '@/components/TopHeader';
import { addHeroSection } from '@/functions/home-page/hero';
import { HeroSectionProps } from '@/types/HomePage';
import React, { useState } from 'react'
import { useRouter } from "next/navigation";

const Page = () => {

    const router = useRouter()

    const [formData, setFormData] = useState<HeroSectionProps[] | undefined>()
    const [loading, setLoading] = useState<boolean>(false)

    const handleInfoChange = (data: HeroSectionProps[]) => {
        const updatedData = data.map(item => ({
            ...item,
            clientId: "client-2055"
        }));
        setFormData(updatedData);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            console.log("Form data being submitted:", formData);
            const res = await addHeroSection(formData);



            if (res != null) {
                console.log("Form submitted successfully:", res);
                router.push("/");
            } else {
                console.error("Error submitting form");
            }
        } catch (error: unknown) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full border-4 border-primary border-t-transparent w-16 h-16" />
                <p className="text-lg font-medium">Loading other section data...</p>
            </div>
        </div>
    }


    return (
        <div>
            <form onSubmit={handleSubmit}  >
                <div className="h-5"></div>
                <TopHeader
                    buttonText={"Save"}
                    tagTitle="Hero Section Slides"
                    title={`set up Home Page`}
                    buttonDisable={false}
                />

                <div className="h-10"></div>

                <HeroSectionEditableCard slid={formData} onSlidChange={handleInfoChange} />

            </form>

        </div>
    )
}

export default Page
