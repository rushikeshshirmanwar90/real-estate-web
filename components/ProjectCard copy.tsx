"use client"

import { useState } from "react"
import {
    MapPin,
    Ruler,
    WavesIcon,
    Wifi,
    SquareParking,
    ClubIcon as VolleyballIcon,
    Ellipsis,
    Trash,
    Pencil,
    PlusSquareIcon,
    Building2,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Section {
    id: string
    name: string
    type: "building" | "row house" | "other"
}

const ProjectCard = () => {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [showAddSection, setShowAddSection] = useState(false)
    const [sections, setSections] = useState<Section[]>([])
    const [newSection, setNewSection] = useState({
        name: "",
        type: "" as Section["type"],
    })

    const handleDelete = () => {
        // Add your delete logic here
        console.log("Project deleted")
        setShowDeleteAlert(false)
    }

    const handleAddSection = () => {
        if (newSection.name && newSection.type) {
            setSections([
                ...sections,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    ...newSection,
                },
            ])
            setNewSection({ name: "", type: "" as Section["type"] })
            setShowAddSection(false)
        }
    }

    return (
        <div className="w-[68rem] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex">
                {/* Image Section */}
                <div className="w-1/2 relative">
                    <img
                        src="https://res.cloudinary.com/dlcq8i2sc/image/upload/v1736101192/zecgarxhsduxqobi1szb.jpg"
                        alt="Luxury Suite Villa"
                        className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white text-gray-800 text-sm font-bold px-3 py-1 rounded-lg shadow">
                        OnGoing
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-1/2 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Luxury Suite Villa</h2>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                                    <Ellipsis className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Project Activity</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit Project
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
                                        <Trash className="mr-2 h-4 w-4" /> Delete Project
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e: any) => {
                                        e.preventDefault();
                                        setShowAddSection(true)
                                    }}>
                                        <PlusSquareIcon className="mr-2 h-4 w-4" /> Add Section
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                            <MapPin className="text-red-500 w-4 h-4" /> Los Angeles City, CA, USA
                        </p>

                        <p className="text-gray-500 text-sm mt-3">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim iste quis natus.
                        </p>

                        <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                                <Ruler className="w-4 h-4" /> 1200 sq
                            </div>
                        </div>

                        <div className="mt-3 flex gap-2 flex-wrap">
                            <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700">
                                <WavesIcon className="w-4 h-4" /> Swimming Pool
                            </div>
                            <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700">
                                <Wifi className="w-4 h-4" /> Wifi
                            </div>
                            <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700">
                                <SquareParking className="w-4 h-4" /> Parking area
                            </div>
                            <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700">
                                <VolleyballIcon className="w-4 h-4" /> Playing Ground
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <button className="bg-[#073B3A] text-white text-center py-2 rounded-xl mt-3 hover:bg-[#073b3aed] transition">
                        View Project
                    </button>
                </div>
            </div>

            {/* Sections Area */}
            {sections.length > 0 && (
                <div className="p-5 border-t">
                    <h3 className="text-lg font-semibold mb-4">Project Sections</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {sections.map((section) => (
                            <div key={section.id} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">{section.name}</h4>
                                    <Badge variant="secondary">
                                        <Building2 className="w-3 h-3 mr-1" />
                                        {section.type}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Delete Alert Dialog */}
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project and all of its data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Add Section Dialog */}
            <Dialog open={showAddSection} onOpenChange={setShowAddSection}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Section</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="name">Section Name</label>
                            <Input
                                id="name"
                                value={newSection.name}
                                onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                                placeholder="Enter section name"
                            />
                            
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="type">Section Type</label>
                            <Select
                                value={newSection.type}
                                onValueChange={(value) => setNewSection({ ...newSection, type: value as Section["type"] })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select section type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="building">Building</SelectItem>
                                    <SelectItem value="row house">Row House</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowAddSection(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddSection}>Add Section</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ProjectCard