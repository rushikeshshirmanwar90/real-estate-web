'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'sonner'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formSchema, type FormValues } from './schema'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { addProject, getSingleProject, updateProject } from '@/functions/project/crud'
import ImageHandler from '@/components/image-handler'

const ProjectForm = () => {
    const searchParams = useSearchParams()
    const projectId = searchParams.get('id')

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [uploadedImages, setUploadedImages] = useState<string[]>([])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            totalBuilding: 1,
            images: [],
            state: '',
            city: '',
            area: '',
            address: '',
            description: '',
            clientId: '64afc2e1d2b2346789abc002'
        }
    })

    const onSubmit = async (formData: FormValues) => {
        console.log("working")
        setIsLoading(true)
        try {
            if (projectId) {
                const data = await updateProject(formData, projectId)
                if (!data) {
                    toast.error("Can't update project")
                } else {
                    toast.success("Project updated successfully!", {
                        description: `${formData.name} has been updated.`,
                    })
                }
            } else {
                const data = await addProject(formData)
                if (!data) {
                    toast.error("Failed to add project")
                } else {
                    toast.success("Project created successfully!", {
                        description: `${data.name} has been created.`,
                    })
                    form.reset()
                    setUploadedImages([])
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            toast.error("Failed to submit project.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (projectId) {
            setIsLoading(true)
            getSingleProject(projectId)
                .then((project) => {
                    if (project) {
                        form.reset({
                            name: project.name,
                            totalBuilding: project.totalBuilding,
                            images: project.images || [],
                            state: project.state,
                            city: project.city,
                            area: project.area,
                            address: project.address,
                            description: project.description,
                            clientId: '64afc2e1d2b2346789abc002'
                        })
                        setUploadedImages(project.images || [])
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch project data:", error)
                    toast.error("Failed to fetch project data.")
                })
                .finally(() => setIsLoading(false))
        }
    }, [projectId, form])

    return (
        <div className="min-h-screen p-4">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>{projectId ? 'Edit Project' : 'Add New Project'}</CardTitle>
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

                            <ImageHandler form={form} isLoading={isLoading} setIsLoading={setIsLoading} setUploadedImages={setUploadedImages} uploadedImages={uploadedImages} title='Property Images' />

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
                                        {projectId ? 'Updating...' : 'Submitting...'}
                                    </>
                                ) : (
                                    projectId ? 'Update Project' : 'Add Property'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProjectForm