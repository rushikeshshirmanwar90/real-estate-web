"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, Pencil, X, Check, Loader2 } from "lucide-react"
import { handleImageUpload } from "./functions/image-handling"
import type { EditableSectionCardProps, Field } from "./types/editable-card"

export function EditableSectionCard({
    title,
    fields = [],
    images = [],
    onFieldChange,
    onImagesChange,
    icon,
}: EditableSectionCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
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
            if (field.value !== undefined) {
                onFieldChange?.(field.key, field.value)
            }
        })
        onImagesChange?.(tempImages)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setTempFields([...fields])
        setTempImages([...images])
        setIsEditing(false)
    }

    const handleTempFieldChange = (key: string, value: string | number) => {
        setTempFields((prev) =>
            prev.map((field) => {
                if (field.key === key) {
                    let updatedValue: string | number = value

                    switch (field.type) {
                        case "number":
                            updatedValue = Number(value)
                            break
                        case "select":
                            return { ...field, value: value }
                        default:
                            updatedValue = String(value)
                    }

                    return { ...field, value: updatedValue }
                }
                return field
            }),
        )
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
                            onChange={(e: any) => handleImageUpload(e, setTempImages, setIsLoading)}
                        />
                    </label>
                )}
            </div>
        )
    }

    const renderField = (field: Field) => {
        const currentField = isEditing ? tempFields.find((f) => f.key === field.key) : field

        if (!currentField) return null

        if (isEditing) {
            switch (field.type) {
                case "textarea":
                    return (
                        <Textarea
                            value={currentField.value as string}
                            onChange={(e) => handleTempFieldChange(field.key, e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            required
                        />
                    )
                case "number":
                    return (
                        <Input
                            type="number"
                            value={currentField.value as number}
                            onChange={(e) => handleTempFieldChange(field.key, e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            required
                        />
                    )
                case "select":
                    return (
                        <Select
                            value={String(currentField.value || "")}
                            onValueChange={(value) => handleTempFieldChange(field.key, value)}
                        >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select an option">
                                    {field.options?.find((opt) => String(opt.value) === String(currentField.value))?.label}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={String(option.value)} value={String(option.value)}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                default:
                    return (
                        <Input
                            value={currentField.value as string}
                            onChange={(e) => handleTempFieldChange(field.key, e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            required
                        />
                    )
            }
        }

        return (
            <div className="group rounded-lg bg-white/5 p-3 transition-all hover:bg-white/10">
                <div className="text-xs font-medium uppercase tracking-wider text-white/60">{field.label}</div>
                <div className="mt-1 text-lg font-medium">
                    {field.type === "select" && field.options
                        ? field.options.find((opt) => String(opt.value) === String(field.value))?.label || "-"
                        : field.value || "-"}
                </div>
            </div>
        )
    }

    return (
        <Card className="w-full overflow-hidden bg-gradient-to-br from-[#446B6B] to-[#2D4848] text-white shadow-xl">
            <CardHeader className="border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
                        {icon && <div className="border border-[#073B3A] bg-[#517675] p-2 rounded-full">{icon}</div>}
                        {title}
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
                    <Button type="button"     onClick={handleCancel} className="text-white hover:bg-white/10">
                        <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button type="button"  onClick={handleSave} className="bg-white/10 hover:bg-white/20 text-white">
                        <Check className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

