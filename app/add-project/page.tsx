'use client'

import { useState } from 'react'
import { Plus, Minus, Loader2 } from 'lucide-react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

// Form schema with explicit types
const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    totalBuilding: z.coerce.number().min(1, { message: 'Must have at least 1 building' }),
    images: z.array(
        z.string().url({ message: 'Must be a valid URL' })
    ).min(1, { message: 'At least one image is required' }),
    state: z.string().min(2, { message: 'State must be at least 2 characters' }),
    city: z.string().min(2, { message: 'City must be at least 2 characters' }),
    area: z.string().min(2, { message: 'Area must be at least 2 characters' }),
    address: z.string().min(10, { message: 'Please enter complete address' }),
    description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
})

// Infer TypeScript type from zod schema
type FormValues = z.infer<typeof formSchema>

// Define default values with correct types
const defaultValues: FormValues = {
    name: '',
    totalBuilding: 1,
    images: [''],
    state: '',
    city: '',
    area: '',
    address: '',
    description: '',
}

export default function PropertyForm(): JSX.Element {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: 'onBlur',
    })

    const onSubmit = async (data: FormValues): Promise<void> => {
        try {
            setIsSubmitting(true)

            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Failed to submit property')
            }

            form.reset()
            alert('Property added successfully!')
        } catch (error) {
            console.error('Error submitting property:', error)
            alert('Failed to add property. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Safely watch images array with type assertion
    const images = form.watch('images') || defaultValues.images

    const handleAddImage = (): void => {
        const currentImages = form.getValues('images')
        form.setValue('images', [...currentImages, ''])
    }

    const handleRemoveImage = (index: number): void => {
        const currentImages = [...form.getValues('images')]
        currentImages.splice(index, 1)
        form.setValue('images', currentImages)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add New Property</CardTitle>
                <CardDescription>Enter the details of the new property complex</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Green Valley Apartments" {...field} />
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
                                            min="1"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormLabel>Images</FormLabel>
                            {images.map((_, index) => (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={`images.${index}`}
                                    render={({ field }) => (
                                        <FormItem className="flex gap-2">
                                            <FormControl>
                                                <Input placeholder="Image URL" {...field} />
                                            </FormControl>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddImage}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Image URL
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input placeholder="New York" {...field} />
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
                                            <Input placeholder="New York City" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="area"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Area</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Queens" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Complete Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="456 Green Valley Road, Queens, New York, NY 10001" {...field} />
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
                                            placeholder="Describe the property..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding Property...
                                </>
                            ) : (
                                'Add Property'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}