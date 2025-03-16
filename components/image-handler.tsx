import React from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { FormField, FormMessage } from './ui/form'
import { handleImageUpload, removeImage } from '../components/functions/image-handling'

interface formProps {
    control: FieldValues
}

interface ImageHandlerProps {
    uploadedImages: string[],
    form: formProps,
    setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    title: string
}

const ImageHandler: React.FC<ImageHandlerProps> = ({
    uploadedImages,
    form,
    setUploadedImages,
    isLoading,
    setIsLoading,
    title
}) => {
    return (
        <div>
            <div>
                <Label>{title}</Label>
                <div className="mt-2 space-y-4">
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {uploadedImages.map((url: string, index: number) => (
                            <div key={index} className="relative aspect-square">
                                <img
                                    src={url}
                                    alt={`Property ${index + 1}`}
                                    className="object-cover w-full h-full rounded-lg"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => removeImage(index, form, setUploadedImages)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <div className="aspect-square relative">
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageUpload(e, setIsLoading, setUploadedImages, form)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isLoading}
                            />
                            <div className="h-full border-2 border-dashed rounded-lg flex items-center justify-center">
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <ImagePlus className="h-6 w-6" />
                                )}
                            </div>
                        </div>
                    </div>
                    <FormField
                        control={form.control}
                        name="images"
                        render={() => (
                            <FormMessage />
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default ImageHandler