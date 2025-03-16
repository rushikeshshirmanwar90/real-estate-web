"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PlusCircle, Trash2, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { projectProps } from "@/app/projects/types/project-props"
import type { BuildingProps } from "@/app/projects/types/building-props"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import domain from "../utils/domain"
import { getClientId } from "@/functions/getClientId"
// Matched with the PropertySchema in Mongoose


export interface CustomerData {
    _id?: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    properties: PropertyItem[]
    userType: string
    clientId: string
}


interface SectionData {
    sectionId: string
    name: string
    type: string
}



interface FlatInfo {
    _id: string
    title: string
    totalFlats: number
    totalBookedFlats: number
}

interface PropertyItem {
    id: string
    projectId: string
    projectName: string
    sectionId: string
    sectionName: string
    sectionType: string
    flatId?: string
    flatName: string
}

const propertySchema = z.object({
    projectId: z.string({
        required_error: "Please select a project",
    }),
    sectionId: z.string({
        required_error: "Please select a section",
    }),
    flatId: z.string().optional(),
    flatName: z.string().optional(),
})

const formSchema = z.object({
    userType: z.string(),
    clientId: z.string(),
    firstName: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phoneNumber: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    })
})

export const AddCustomerDialog: React.FC<{ addCustomer: (data: CustomerData) => void, userId?: string }> = ({ addCustomer }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [projects, setProjects] = useState<projectProps[]>([])
    const [building, setBuilding] = useState<BuildingProps[]>([])

    // Property form state
    const [selectedProject, setSelectedProject] = useState<string>("")
    const [selectedSection, setSelectedSection] = useState<string>("")
    const [selectedSectionType, setSelectedSectionType] = useState<string>("")
    const [filteredSections, setFilteredSections] = useState<SectionData[]>([])
    const [availableFlats, setAvailableFlats] = useState<FlatInfo[]>([])

    // Property list state
    const [properties, setProperties] = useState<PropertyItem[]>([])
    const [isAddingProperty, setIsAddingProperty] = useState(false)
    const [editingPropertyIndex, setEditingPropertyIndex] = useState<number | null>(null)

    const fetchBuilding = async () => {
        const res = await axios.get(`${domain}/api/building`)
        const data = res.data
        setBuilding(data)
    }


    const fetchProjects = async () => {
        const res = await axios.get(`${domain}/api/project`)
        const data = res.data
        setProjects(data)
    }

    const fetchClientId = async () => {
        try {
            const id = await getClientId();
            if (id) {
                form.setValue("clientId", id);
            }
        } catch (error) {
            console.error("Error fetching client ID:", error);
        }
    };


    useEffect(() => {
        fetchProjects()
        fetchBuilding()
    }, [])

    useEffect(() => {
        if (selectedProject) {
            const project = projects.find((p) => p._id === selectedProject)
            if (project && project.section) {
                setFilteredSections(project.section)
            } else {
                setFilteredSections([])
            }

            if (editingPropertyIndex === null) {
                setSelectedSection("")
                setSelectedSectionType("")
                setAvailableFlats([])
            }
        }
    }, [selectedProject, projects, editingPropertyIndex])

    useEffect(() => {
        if (selectedSection && selectedSectionType === "Buildings") {
            const buildingData = building.find((b) => b._id === selectedSection)
            if (buildingData && buildingData.flatInfo) {
                setAvailableFlats(buildingData.flatInfo)
            } else {
                setAvailableFlats([])
            }

        } else {
            setAvailableFlats([])

        }
    }, [selectedSection, selectedSectionType, building, editingPropertyIndex])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientId: "",
            userType: "customer",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
        },
    })

    const propertyForm = useForm<z.infer<typeof propertySchema>>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            projectId: "",
            sectionId: "",
            flatId: "",
            flatName: "",
        },
    })

    const handleSectionChange = (sectionId: string) => {
        const section = filteredSections.find((s) => s.sectionId === sectionId)
        if (section) {
            setSelectedSection(section.sectionId)
            setSelectedSectionType(section.type)
            propertyForm.setValue("sectionId", section.sectionId)
        } else {
            setSelectedSection("")
            setSelectedSectionType("")
            propertyForm.setValue("sectionId", "")
        }
        propertyForm.setValue("flatId", "")
        propertyForm.setValue("flatName", "")

    }

    const handleAddProperty = () => {
        propertyForm.reset({
            projectId: "",
            sectionId: "",
            flatId: "",
            flatName: "",
        })
        setSelectedProject("")
        setSelectedSection("")
        setSelectedSectionType("")
        setIsAddingProperty(true)
        setEditingPropertyIndex(null)
    }

    const handleEditProperty = (index: number) => {
        const property = properties[index]

        setSelectedProject(property.projectId)
        setSelectedSection(property.sectionId)
        setSelectedSectionType(property.sectionType)


        propertyForm.reset({
            projectId: property.projectId,
            sectionId: property.sectionId,
            flatId: property.flatId,
            flatName: property.flatName,
        })

        setIsAddingProperty(true)
        setEditingPropertyIndex(index)
    }

    const handleRemoveProperty = (index: number) => {
        setProperties(properties.filter((_, i) => i !== index))
    }

    const handlePropertySubmit = (values: z.infer<typeof propertySchema>) => {
        // This function is kept for reference but no longer used directly
        console.log("Form submitted with values:", values)
    }

    const cancelPropertyEdit = () => {
        setIsAddingProperty(false)
        setEditingPropertyIndex(null)
        propertyForm.reset()
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        const customerData = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            properties: properties,
            userType: values.userType,
            clientId: values.clientId
        }
        addCustomer(customerData);
        setOpen(false)
        form.reset()
        setProperties([])
    }


    useEffect(() => {
        fetchClientId();
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>Fill in the details to add a new customer to the system.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Smith" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john.smith@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+91 0000000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Properties</h3>
                                {!isAddingProperty && (
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddProperty}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Property
                                    </Button>
                                )}
                            </div>

                            {/* Property List */}
                            {properties.length > 0 && !isAddingProperty && (
                                <div className="space-y-3">
                                    {properties.map((property, index) => (
                                        <Card key={property.id}>
                                            <CardHeader className="py-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-base">{property.projectName}</CardTitle>
                                                        <CardDescription>
                                                            {property.sectionName} ({property.sectionType})
                                                            {property.flatName && ` - ${property.flatName}`}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleEditProperty(index)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemoveProperty(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {properties.length === 0 && !isAddingProperty && (
                                <div className="text-center py-6 border border-dashed rounded-lg">
                                    <p className="text-muted-foreground">No properties added yet</p>
                                </div>
                            )}

                            {/* Property Form */}
                            {isAddingProperty && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">
                                            {editingPropertyIndex !== null ? "Edit Property" : "Add Property"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...propertyForm}>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault() // Prevent default form submission
                                                    propertyForm.handleSubmit(handlePropertySubmit)(e)
                                                }}
                                                className="space-y-4"
                                            >
                                                <FormField
                                                    control={propertyForm.control}
                                                    name="projectId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Project</FormLabel>
                                                            <Select
                                                                onValueChange={(value) => {
                                                                    field.onChange(value)
                                                                    setSelectedProject(value)
                                                                }}
                                                                value={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a project" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {projects.map((project) => (
                                                                        <SelectItem key={project._id} value={project._id}>
                                                                            {project.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {selectedProject && (
                                                    <FormField
                                                        control={propertyForm.control}
                                                        name="sectionId"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Section</FormLabel>
                                                                <Select
                                                                    onValueChange={(value) => {
                                                                        field.onChange(value)
                                                                        handleSectionChange(value)
                                                                    }}
                                                                    value={field.value}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select a section" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {filteredSections.map((section) => (
                                                                            <SelectItem key={section.sectionId} value={section.sectionId}>
                                                                                {section.name} ({section.type})
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}

                                                {selectedSectionType === "Buildings" && availableFlats.length > 0 && (
                                                    <FormField
                                                        control={propertyForm.control}
                                                        name="flatId"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Flat</FormLabel>
                                                                <Select
                                                                    onValueChange={(value) => {
                                                                        field.onChange(value)
                                                                    }}
                                                                    value={field.value}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select a flat" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {availableFlats.map((flat) => (
                                                                            <SelectItem key={flat._id} value={flat._id}>
                                                                                {flat.title} ({flat.totalFlats - flat.totalBookedFlats} available)
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}

                                                <FormField
                                                    control={propertyForm.control}
                                                    name="flatName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                {selectedSectionType === "Buildings" ? "Flat Number" : "Row House Number"}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder={selectedSectionType === "Buildings" ? "e.g., 101" : "e.g., RH-5"}
                                                                    {...field}
                                                                    onChange={(e) => {
                                                                        field.onChange(e)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="flex justify-end gap-2 pt-2">
                                                    <Button type="button" variant="outline" onClick={cancelPropertyEdit}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => {
                                                            // Manually trigger form validation
                                                            propertyForm.trigger().then((isValid) => {
                                                                if (isValid) {
                                                                    // Get the current form values
                                                                    const values = propertyForm.getValues()

                                                                    // Process the form data manually
                                                                    const project = projects.find((p) => p._id === values.projectId)
                                                                    const section = filteredSections.find((s) => s.sectionId === values.sectionId)
                                                                    const flatName = values.flatName || "" // Use the input as flatName

                                                                    if (values.flatId && selectedSectionType === "Buildings") {
                                                                        const flat = availableFlats.find((f) => f._id === values.flatId)
                                                                        if (flat) {
                                                                            // Store flatInfoId at the form level for the schema
                                                                        }
                                                                    }

                                                                    const newProperty: PropertyItem = {
                                                                        id: editingPropertyIndex !== null
                                                                            ? properties[editingPropertyIndex].id
                                                                            : Date.now().toString(),
                                                                        projectId: values.projectId,
                                                                        projectName: project?.name || "",
                                                                        sectionId: values.sectionId,
                                                                        sectionName: section?.name || "",
                                                                        sectionType: selectedSectionType,
                                                                        flatId: values.flatId,
                                                                        flatName: flatName, // This now contains the unit number directly
                                                                    }

                                                                    if (editingPropertyIndex !== null) {
                                                                        // Update existing property
                                                                        const updatedProperties = [...properties]
                                                                        updatedProperties[editingPropertyIndex] = newProperty
                                                                        setProperties(updatedProperties)
                                                                    } else {
                                                                        // Add new property
                                                                        setProperties([...properties, newProperty])
                                                                    }

                                                                    setIsAddingProperty(false)
                                                                    setEditingPropertyIndex(null)
                                                                    propertyForm.reset()
                                                                }
                                                            })
                                                        }}
                                                    >
                                                        {editingPropertyIndex !== null ? "Update" : "Add"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={properties.length === 0}>
                                Add Customer
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}