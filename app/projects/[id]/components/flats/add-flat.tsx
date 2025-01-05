import { FormEvent, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Home } from 'lucide-react';

interface FlatProps {
    name: string;
    building: string | undefined;
    BHK: number;
    area: number;
    description?: string;
    total: number;
    booked: number;
    images: string[];
    ytLink?: string;
}

interface AddFlatProps {
    buildingId: string | undefined;
    onSuccess: () => void;
}

const AddFlat = ({ buildingId, onSuccess }: AddFlatProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    const handleAddFlat = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            const flatData: FlatProps = {
                name: formData.get('name') as string,
                building: buildingId,
                BHK: Number(formData.get('BHK')),
                area: Number(formData.get('area')),
                description: formData.get('description') as string,
                total: Number(formData.get('total')),
                booked: Number(formData.get('booked')),
                images: images,
                ytLink: formData.get('ytLink') as string,
            };

            const response = await fetch('/api/flats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flatData),
            });

            if (!response.ok) {
                throw new Error('Failed to add flat');
            }

            toast.success('Flat added successfully!', {
                description: `${flatData.name} has been added to the building.`,
            });
            onSuccess();
        } catch (error) {
            toast.error('Failed to add flat', {
                description: 'Please try again later.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            setImages((prev) => [...prev, ...imageUrls]);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='w-full'>
                    <Home className="w-4 h-4 mr-2" />
                    Add Flat Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Flat</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddFlat} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Flat Name/Number</Label>
                        <Input id="name" name="name" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="BHK">BHK</Label>
                            <Input id="BHK" name="BHK" type="number" required min="1" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="area">Area (sq ft)</Label>
                            <Input id="area" name="area" type="number" required min="1" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="total">Total Units</Label>
                            <Input id="total" name="total" type="number" required min="1" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="booked">Booked Units</Label>
                            <Input id="booked" name="booked" type="number" required min="0" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="images">Images</Label>
                        <Input
                            id="images"
                            name="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {images.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-20 object-cover rounded-md"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ytLink">YouTube Video Link (Optional)</Label>
                        <Input id="ytLink" name="ytLink" type="url" />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Flat'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddFlat;
