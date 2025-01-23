"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Pencil, X, Check } from "lucide-react"

interface Field {
    key: string
    label: string
    value: string
    type: "text" | "textarea"
}

interface EditableSectionCardProps {
    title: string
    fields?: Field[]
    images?: string[]
    onFieldChange?: (key: string, value: string) => void
    onImagesChange?: (images: string[]) => void
}

export function EditableSectionCard({
    title,
    fields = [],
    images = [],
    onFieldChange,
    onImagesChange,
}: EditableSectionCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [tempFields, setTempFields] = useState<Field[]>(fields)
    const [tempImages, setTempImages] = useState<string[]>(images)
    const hasData = fields.some((field) => field.value) || images.length > 0

    const handleEdit = () => {
        setTempFields([...fields])
        setTempImages([...images])
        setIsEditing(true)
    }

    const handleSave = () => {
        tempFields.forEach((field) => {
            onFieldChange?.(field.key, field.value)
        })
        onImagesChange?.(tempImages)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setTempFields([...fields])
        setTempImages([...images])
        setIsEditing(false)
    }

    const handleTempFieldChange = (key: string, value: string) => {
        setTempFields((prev) => prev.map((field) => (field.key === key ? { ...field, value } : field)))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
        setTempImages((prev) => [...prev, ...newImages])
    }

    const removeImage = (index: number) => {
        setTempImages((prev) => prev.filter((_, i) => i !== index))
    }

    const renderImageSection = () => {
        if (!onImagesChange) return null

        const displayImages = isEditing ? tempImages : images

        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {displayImages.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                        <img
                            src={image || "/placeholder.svg"}
                            alt={`Uploaded image ${index + 1}`}
                            className="h-full w-full rounded-lg object-cover"
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
                ))}
                {isEditing && (
                    <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/20 hover:border-white/40">
                        <div className="flex flex-col items-center gap-2">
                            <ImagePlus className="h-8 w-8 text-white/60" />
                            <span className="text-sm text-white/60">Add Image</span>
                        </div>
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                    </label>
                )}
            </div>
        )
    }

    const renderField = (field: Field) => {
        const currentField = isEditing ? tempFields.find((f) => f.key === field.key) : field

        if (!currentField) return null

        if (isEditing) {
            return field.type === "textarea" ? (
                <Textarea
                    value={currentField.value}
                    onChange={(e) => handleTempFieldChange(field.key, e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                />
            ) : (
                <Input
                    value={currentField.value}
                    onChange={(e) => handleTempFieldChange(field.key, e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                />
            )
        }

        return (
            <div className="group rounded-lg bg-white/5 p-3 transition-all hover:bg-white/10">
                <div className="text-xs font-medium uppercase tracking-wider text-white/60">{field.label}</div>
                <div className="mt-1 text-lg font-medium">{field.value || "-"}</div>
            </div>
        )
    }

    return (
        <Card className="w-full overflow-hidden bg-gradient-to-br from-[#446B6B] to-[#2D4848] text-white shadow-xl">
            <CardHeader className="border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">  {title}</h2>
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
                        <span className="mr-2 text-lg">+</span> Add Information
                    </Button>
                ) : (
                    <div className="space-y-6">
                        {renderImageSection()}
                        <div className={isEditing ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
                            {fields.map((field) => (
                                <div key={field.key} className={isEditing ? "space-y-2" : ""}>
                                    {isEditing && <label className="text-sm font-medium text-white/90">{field.label}</label>}
                                    {renderField(field)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
            {isEditing && (
                <CardFooter className="border-t border-white/10 bg-white/5 gap-4 justify-end pt-3">
                    <Button variant="ghost" onClick={handleCancel} className="text-white hover:bg-white/10">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-white/10 hover:bg-white/20 text-white">
                        <Check className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}