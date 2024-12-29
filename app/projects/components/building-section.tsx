import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PlusSquare, Edit, Trash2, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent } from 'react';

interface BuildingProps {
    _id: string;
    name: string;
    totalFlats: number;
    projectId: string | undefined;
}

interface ProjectProps {
    _id: string;
    totalBuilding: number;
}

interface BuildingsSectionProps {
    project: ProjectProps | undefined;
    buildings: BuildingProps[];
    onAddBuilding: (newBuilding: BuildingProps) => void;
    onDeleteBuilding: (index: number) => void;
}

export default function BuildingsSection({
    project,
    buildings,
    onAddBuilding,
    onDeleteBuilding,
}: BuildingsSectionProps) {
    const handleAddBuilding = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newBuilding: BuildingProps = {
            _id: Math.random().toString(),
            name: formData.get('name') as string,
            totalFlats: Number(formData.get('totalFlats')),
            projectId: project?._id,
        };
        onAddBuilding(newBuilding);
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Buildings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: project?.totalBuilding ?? 0 }).map((_, index) => {
                    const building = buildings[index];
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle>
                                    {building ? building.name : `Building ${index + 1}`}
                                </CardTitle>
                                <div className="flex gap-2">
                                    {building && (
                                        <>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Building</DialogTitle>
                                                    </DialogHeader>
                                                    <form onSubmit={handleAddBuilding} className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="name">Building Name</Label>
                                                            <Input
                                                                id="name"
                                                                name="name"
                                                                defaultValue={building.name}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="totalFlats">Total Flats</Label>
                                                            <Input
                                                                id="totalFlats"
                                                                name="totalFlats"
                                                                type="number"
                                                                defaultValue={building.totalFlats}
                                                                required
                                                            />
                                                        </div>
                                                        <Button type="submit" className="w-full">
                                                            Update Building
                                                        </Button>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently
                                                            delete the building data.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => onDeleteBuilding(index)}
                                                            className="bg-destructive text-destructive-foreground"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {building ? (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-muted-foreground">Total Flats</p>
                                            <p>{building.totalFlats}</p>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full" variant="outline">
                                                    <Home className="w-4 h-4 mr-2" />
                                                    Add Flat Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <form className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="flatNumber">Flat Number</Label>
                                                        <Input id="flatNumber" name="flatNumber" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="floorNumber">Floor Number</Label>
                                                        <Input
                                                            id="floorNumber"
                                                            name="floorNumber"
                                                            type="number"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="area">Area (sq ft)</Label>
                                                        <Input id="area" name="area" type="number" required />
                                                    </div>
                                                    <Button type="submit" className="w-full">
                                                        Add Flat
                                                    </Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ) : (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="flex items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:bg-accent hover:cursor-pointer transition-colors">
                                                <PlusSquare className="w-10 h-10 text-muted-foreground" />
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Building</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleAddBuilding} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Building Name</Label>
                                                    <Input id="name" name="name" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="totalFlats">Total Flats</Label>
                                                    <Input
                                                        id="totalFlats"
                                                        name="totalFlats"
                                                        type="number"
                                                        required
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full">
                                                    Add Building
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
