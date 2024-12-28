'use client'
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Loader2, X } from 'lucide-react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { formSchema, type FormValues } from './schema'

export default function ApartmentForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<string[]>([])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            totalBuilding: 0,
            images: [],
            state: '',
            city: '',
            area: '',
            address: '',
            description: '',
            clientId: '64afc2e1d2b2346789abc002'
        }
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsLoading(true);
        const uploadedFiles = Array.from(e.target.files);
        const uploadPromises = uploadedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'realEstate');

            console.log("Uploading file:", file);
            console.log("FormData:", [...formData.entries()]);

            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/dlcq8i2sc/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Cloudinary error:', errorData);
                    return null;
                }
                const data = await response.json();
                return data.secure_url;
            } catch (error) {
                console.error('Upload failed:', error);
                return null;
            }
        });

        const urls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
        setUploadedImages((prev) => [...prev, ...urls]);
        const currentImages = form.getValues('images') || [];
        form.setValue('images', [...currentImages, ...urls]);
        setIsLoading(false);
    };
    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index))
        const currentImages = form.getValues('images') || []
        form.setValue(
            'images',
            currentImages.filter((_, i) => i !== index)
        )
    }

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)

        try {
            const response = await fetch('http://localhost:3000/api/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error('Submission failed')

            console.log('Apartment added successfully')
        } catch (error: any) {
            console.log('Error:', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen p-4">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Add New Apartment Complex</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="totalBuilding"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Buildings</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div>
                                <Label>Property Images</Label>
                                <div className="mt-2 space-y-4">
                                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {uploadedImages.map((url, index) => (
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
                                                    onClick={() => removeImage(index)}
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
                                                onChange={handleImageUpload}
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
                                        render={({ field }) => (
                                            <FormMessage />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Area</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Address</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="h-32"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Add Property'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

