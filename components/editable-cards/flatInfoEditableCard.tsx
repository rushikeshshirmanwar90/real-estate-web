"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Pencil, X, Check, Loader2, Building2 } from "lucide-react"

const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUpload: (urls: string[]) => void,
    setLoading: (loading: boolean) => void,
) => {
    const files = e.target.files
    if (!files?.length) return

    setLoading(true)
    try {
        // For now, we'll use URL.createObjectURL for local preview
        // In production, you'd want to upload these to your server/storage
        const urls = Array.from(files).map((file) => URL.createObjectURL(file))
        onUpload(urls)
    } catch (error) {
        console.error("Error uploading images:", error)
    } finally {
        setLoading(false)
    }
}

interface FlatInfo {
    title: string
    description?: string
    images: string[]
    totalFlats: number
    totalBookedFlats: number
    totalArea: number
    video?: string
}

interface FlatInfoEditableCardProps {
    flatInfos: FlatInfo[]
    onFlatInfoChange: (flatInfos: FlatInfo[]) => void
}

export function FlatInfoEditableCard({ flatInfos = [], onFlatInfoChange }: FlatInfoEditableCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [tempFlatInfos, setTempFlatInfos] = useState<FlatInfo[]>(flatInfos)
    const hasData = flatInfos.length > 0

    const handleEdit = () => {
        setTempFlatInfos([...flatInfos])
        setIsEditing(true)
    }

    const handleSave = () => {
        onFlatInfoChange(tempFlatInfos)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setTempFlatInfos([...flatInfos])
        setIsEditing(false)
    }

    const addFlatInfo = () => {
        setTempFlatInfos([
            ...tempFlatInfos,
            {
                title: "",
                description: "",
                images: [],
                totalFlats: 0,
                totalBookedFlats: 0,
                totalArea: 0,
                video: "",
            },
        ])
    }

    const removeFlatInfo = (index: number) => {
        setTempFlatInfos(tempFlatInfos.filter((_, i) => i !== index))
    }

    const updateFlatInfo = (index: number, field: keyof FlatInfo, value: string | number) => {
        setTempFlatInfos(tempFlatInfos.map((flatInfo, i) => (i === index ? { ...flatInfo, [field]: value } : flatInfo)))
    }

    const handleFlatInfoImages = (flatIndex: number, images: string[]) => {
        setTempFlatInfos(tempFlatInfos.map((flatInfo, i) => (i === flatIndex ? { ...flatInfo, images } : flatInfo)))
    }

    const removeImage = (flatIndex: number, imageIndex: number) => {
        setTempFlatInfos(
            tempFlatInfos.map((flatInfo, i) =>
                i === flatIndex
                    ? {
                        ...flatInfo,
                        images: flatInfo.images.filter((_, imgIndex) => imgIndex !== imageIndex),
                    }
                    : flatInfo,
            ),
        )
    }

    return (
        <Card className="w-full overflow-hidden bg-gradient-to-br from-[#446B6B] to-[#2D4848] text-white shadow-xl">
            <CardHeader className="border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
                        <div className="border border-[#073B3A] bg-[#517675] p-2 rounded-full">
                            <Building2 size={20} color="#073B3A" />
                        </div>
                        Flat Information
                    </h2>
                    {hasData && !isEditing && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleEdit}
                            className="h-8 w-8 rounded-full text-white transition-colors hover:bg-white/10 hover:text-white/90"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {!hasData && !isEditing ? (
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white/90" onClick={handleEdit}>
                        <span className="mr-2 text-lg">+</span> Add Flat Information
                    </Button>
                ) : (
                    <div className="space-y-6">
                        {(isEditing ? tempFlatInfos : flatInfos).map((flatInfo, index) => (
                            <div key={index} className="relative space-y-4 rounded-lg bg-white/5 p-4">
                                {isEditing && (
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                                        onClick={() => removeFlatInfo(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                                {isEditing ? (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/90">Title</label>
                                            <Input
                                                value={flatInfo.title}
                                                onChange={(e) => updateFlatInfo(index, "title", e.target.value)}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/90">Description</label>
                                            <Textarea
                                                value={flatInfo.description}
                                                onChange={(e) => updateFlatInfo(index, "description", e.target.value)}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/90">Total Flats</label>
                                            <Input
                                                type="number"
                                                value={flatInfo.totalFlats}
                                                onChange={(e) => updateFlatInfo(index, "totalFlats", Number.parseInt(e.target.value))}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                                required
                                                min={0}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/90">Total Booked Flats</label>
                                            <Input
                                                type="number"
                                                value={flatInfo.totalBookedFlats}
                                                onChange={(e) => updateFlatInfo(index, "totalBookedFlats", Number.parseInt(e.target.value))}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                                required
                                                min={0}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/90">Total Area (sq ft)</label>
                                            <Input
                                                type="number"
                                                value={flatInfo.totalArea}
                                                onChange={(e) => updateFlatInfo(index, "totalArea", Number.parseInt(e.target.value))}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                                required
                                                min={0}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/90">Video URL</label>
                                            <Input
                                                value={flatInfo.video || ""}
                                                onChange={(e) => updateFlatInfo(index, "video", e.target.value)}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <div className="text-lg font-medium">{flatInfo.title}</div>
                                            <div className="text-sm text-white/70">{flatInfo.description}</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-white/70">Total Flats</div>
                                                <div className="text-lg font-medium">{flatInfo.totalFlats}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-white/70">Booked Flats</div>
                                                <div className="text-lg font-medium">{flatInfo.totalBookedFlats}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-white/70">Total Area</div>
                                                <div className="text-lg font-medium">{flatInfo.totalArea} sq ft</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {flatInfo.images.map((image, imageIndex) => (
                                        <div key={imageIndex} className="relative aspect-square">
                                            <img
                                                src={image || "/placeholder.svg"}
                                                alt={`Flat ${index + 1} image ${imageIndex + 1}`}
                                                className="h-full w-full rounded-lg object-cover"
                                            />
                                            {isEditing && (
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                                                    onClick={() => removeImage(index, imageIndex)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {isEditing && (
                                        <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/20 hover:border-white/40">
                                            <div className="flex flex-col items-center gap-2">
                                                {isLoading ? (
                                                    <Loader2 className="h-6 w-6 animate-spin" />
                                                ) : (
                                                    <ImagePlus className="h-8 w-8 text-white/60" />
                                                )}
                                                <span className="text-sm text-white/60">{isLoading ? "Adding Image" : "Add Image"}</span>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    handleImageUpload(
                                                        e,
                                                        (images) => handleFlatInfoImages(index, [...flatInfo.images, ...images]),
                                                        setIsLoading,
                                                    )
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isEditing && (
                            <Button
                                variant="outline"
                                onClick={addFlatInfo}
                                className="w-full border-white/20 text-white hover:bg-white/10"
                            >
                                <span className="mr-2 text-lg">+</span> Add Flat Type
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
            {isEditing && (
                <CardFooter className="border-t border-white/10 bg-white/5 gap-4 justify-end pt-3">
                    <Button type="button" onClick={handleCancel} className="text-white hover:bg-white/10">
                        <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button type="button" onClick={handleSave} className="bg-white/10 hover:bg-white/20 text-white">
                        <Check className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}