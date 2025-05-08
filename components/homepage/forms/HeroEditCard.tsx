"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Pencil, X, Check, Loader2, LayoutGrid } from "lucide-react"
import { handleImageUpload } from "@/components/functions/image-handling"
import { HeroSectionProps } from "@/types/HomePage"
import Image from "next/image"

interface HeroSectionEditableCardProps {
    slid: HeroSectionProps[] | undefined
    onSlidChange: (slid: HeroSectionProps[]) => void
}

export function HeroSectionEditableCard({ slid = [], onSlidChange }: HeroSectionEditableCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [tmpSlidData, setTmpSlidData] = useState<HeroSectionProps[]>(slid)
    const hasData = slid.length > 0

    const handleEdit = () => {
        setTmpSlidData([...slid])
        setIsEditing(true)
    }

    const handleSave = () => {
        onSlidChange(tmpSlidData)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setTmpSlidData([...slid])
        setIsEditing(false)
    }

    const addSection = () => {
        setTmpSlidData([...tmpSlidData, {
            title: "",
            description: "",
            image: "",
            buttonText: "",
            buttonLink: ""
        }])
    }

    const removeSection = (index: number) => {
        setTmpSlidData(tmpSlidData.filter((_, i) => i !== index))
    }

    const updateSection = (index: number, field: keyof HeroSectionProps, value: string) => {
        setTmpSlidData(tmpSlidData.map((section, i) => (i === index ? { ...section, [field]: value } : section)))
    }

    const handleSectionImage = async (sectionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        // Create a dummy setter that matches the expected type
        const dummySetImages: React.Dispatch<React.SetStateAction<string[]>> = () => { };

        // Call the original function but ignore its state updates
        const urls = await handleImageUpload(e, dummySetImages, setIsLoading);

        // Update with just the first image URL
        if (urls && urls.length > 0) {
            setTmpSlidData((prev) =>
                prev.map((section, i) =>
                    i === sectionIndex
                        ? { ...section, image: urls[0] }
                        : section
                )
            );
        }
    };

    const removeImage = (sectionIndex: number) => {
        setTmpSlidData((prev) =>
            prev.map((section, i) =>
                i === sectionIndex
                    ? { ...section, image: "" }
                    : section,
            ),
        )
    }

    return (
        <Card className="w-full overflow-hidden bg-card shadow-xl">
            <CardHeader className="border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
                        <div className="border border-border bg-primary/10 p-2 rounded-full">
                            <LayoutGrid size={20} className="text-primary" />
                        </div>
                        Hero Sections
                    </h2>
                    {hasData && !isEditing && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleEdit}
                            className="h-8 w-8 rounded-full transition-colors hover:bg-muted/50"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {!hasData && !isEditing ? (
                    <Button variant="ghost" className="hover:bg-muted/30" onClick={handleEdit}>
                        <span className="mr-2 text-lg">+</span> Add Hero Section Slides
                    </Button>
                ) : (
                    <div className="w-full">
                        <div className="flex gap-6 overflow-x-auto pb-4">
                            {(isEditing ? tmpSlidData : slid).map((section, index) => (
                                <div key={index} className="relative flex-none w-80 rounded-lg bg-muted/30 p-4">
                                    {isEditing && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                                            onClick={() => removeSection(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {isEditing ? (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Title</label>
                                                <Input
                                                    value={section.title}
                                                    onChange={(e) => updateSection(index, "title", e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                <label className="text-sm font-medium">Description</label>
                                                <Textarea
                                                    value={section.description}
                                                    onChange={(e) => updateSection(index, "description", e.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                <label className="text-sm font-medium">Button Text</label>
                                                <Input
                                                    value={section.buttonText}
                                                    onChange={(e) => updateSection(index, "buttonText", e.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                <label className="text-sm font-medium">Button Link</label>
                                                <Input
                                                    value={section.buttonLink}
                                                    onChange={(e) => updateSection(index, "buttonLink", e.target.value)}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="text-lg font-medium">{section.title}</div>
                                            <div className="text-sm text-muted-foreground">{section.description}</div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-sm font-medium">Button:</span>
                                                <span className="text-sm text-muted-foreground">{section.buttonText}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Link:</span>
                                                <span className="text-sm text-muted-foreground">{section.buttonLink}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-4">
                                        {section.image ? (
                                            <div className="relative aspect-video w-full">
                                                <Image
                                                    src={section.image || "/placeholder.svg"}
                                                    alt={`Hero Section ${index + 1}`}
                                                    className="h-full w-full rounded-lg object-cover"
                                                    width={500}
                                                    height={500}
                                                />
                                                {isEditing && (
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ) : isEditing && (
                                            <label className="flex aspect-video w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    {isLoading ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                                                    )}
                                                    <span className="text-sm text-muted-foreground">
                                                        {isLoading ? "Adding Image" : "Add Image"}
                                                    </span>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleSectionImage(index, e)}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isEditing && (
                                <Button variant="outline" onClick={addSection} className="h-full min-w-48">
                                    <span className="mr-2 text-lg">+</span> Add Hero Section
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
            {isEditing && (
                <CardFooter className="border-t border-border bg-muted/30 gap-4 justify-end pt-3">
                    <Button type="button" onClick={handleCancel} variant="outline">
                        <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button type="button" onClick={handleSave}>
                        <Check className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}