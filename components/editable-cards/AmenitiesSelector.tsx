import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    X,
    Plus,
    Search,
    Camera,
    Settings,
    User,
    Home,
    Mail,
    Phone,
    Wifi,
    Tv,
    Car,
    Coffee,
    Bath,
    Bed,
    Hotel,
    Key,
    Computer,
    Sun,
    Music
} from "lucide-react";

export interface AmenityItem {
    name: string;
    icon: string;
}

interface AmenitiesSelectorProps {
    selectedAmenities?: AmenityItem[];
    onAmenitiesChange: (amenities: AmenityItem[]) => void;
}

const iconComponents = {
    Camera,
    Settings,
    User,
    Home,
    Mail,
    Phone,
    Wifi,
    Tv,
    Car,
    Coffee,
    Bath,
    Bed,
    Hotel,
    Key,
    Computer,
    Sun,
    Music,
    X
};

export const DisplayIcon = ({ iconName, size = 32, color = "white" }: { iconName: string, size?: number, color?: string }) => {
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents];
    return IconComponent ? <IconComponent size={size} color={color} /> : <X size={size} />;
};

const AmenitiesSelector: React.FC<AmenitiesSelectorProps> = ({
    selectedAmenities = [],
    onAmenitiesChange,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [tempSelectedIcon, setTempSelectedIcon] = useState<string | null>(null);
    const [tempAmenityName, setTempAmenityName] = useState("");

    const availableIcons = useMemo(() => {
        return Object.keys(iconComponents);
    }, []);

    const filteredIcons = useMemo(() => {
        if (!searchQuery.trim()) return availableIcons;
        return availableIcons.filter((iconName) =>
            iconName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [availableIcons, searchQuery]);

    const handleIconClick = (iconName: string) => {
        setTempSelectedIcon(iconName);
    };

    const handleAddAmenity = () => {
        if (tempSelectedIcon && tempAmenityName.trim()) {
            const newAmenity = {
                name: tempAmenityName.trim(),
                icon: tempSelectedIcon,
            };
            const currentAmenities = Array.isArray(selectedAmenities) ? selectedAmenities : [];
            onAmenitiesChange([...currentAmenities, newAmenity]);
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTempSelectedIcon(null);
        setTempAmenityName("");
        setSearchQuery("");
    };

    const handleRemoveAmenity = (index: number) => {
        if (!Array.isArray(selectedAmenities)) return;
        const updatedAmenities = selectedAmenities.filter((_, i) => i !== index);
        onAmenitiesChange(updatedAmenities);
    };

    const renderSelectedAmenities = () => {
        if (!Array.isArray(selectedAmenities) || selectedAmenities.length === 0) {
            return (
                <div>
                    No Amenities
                </div>
            );
        }

        return (
            <div className="grid grid-cols-3 gap-4">
                {selectedAmenities.map((amenity, index) => (
                    <div
                        key={index}
                        className="relative border  rounded-lg p-3 flex flex-col items-center"
                    >
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => handleRemoveAmenity(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <DisplayIcon iconName={amenity.icon} />
                        <p className="text-sm text-center mt-2">{amenity.name}</p>
                    </div>
                ))}
            </div>
        );
    };

    const renderIconGrid = () => {
        if (!Array.isArray(filteredIcons) || filteredIcons.length === 0) {
            return (
                <div className="text-center py-4 text-gray-500">
                    No icons found matching your search
                </div>
            );
        }

        return (
            <div className="grid grid-cols-9 gap-3">
                {filteredIcons.map((iconName) => (
                    <div
                        key={iconName}
                        className={`p-2 w-fit  border rounded-lg cursor-pointer transition-all ${tempSelectedIcon === iconName
                            ? "border-[#114443] bg-[#114443] text-[#114443]"
                            : "border-gray-200 hover:bg-[#114443]"
                            }`}
                        onClick={() => handleIconClick(iconName)}
                    >
                        <DisplayIcon iconName={iconName} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Card className="w-full overflow-hidden bg-gradient-to-br from-[#446B6B] to-[#2D4848] text-white shadow-xl">
                <CardHeader className="border-b border-white/10 bg-white/5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-3 text-white">
                            <div className="border border-[#073B3A] bg-[#517675] p-2 rounded-full">
                                <Plus size={20} color="#073B3A" />
                            </div>
                            Amenities
                        </h2>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#517675] text-[#073B3A] border-2 border-[#073B3A] font-semibold hover:bg-[#073B3A] hover:text-[#517675]"
                        >
                            Add Amenity
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6  ">
                    {renderSelectedAmenities()}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[800px] bg-[#395A5A]" >
                    <DialogHeader>
                        <DialogTitle className="text-white">Add New Amenity</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-white">
                                    Search Icons
                                </label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search icons..."
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                    />
                                </div>
                            </div>

                            <div className="max-h-60 overflow-y-auto">
                                {renderIconGrid()}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-white">
                                    Amenity Name
                                </label>
                                <Input
                                    type="text"
                                    value={tempAmenityName}
                                    onChange={(e) => setTempAmenityName(e.target.value)}
                                    placeholder="Enter amenity name"
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCloseModal}
                            className=""
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddAmenity}
                            disabled={!tempSelectedIcon || !tempAmenityName.trim()}
                            variant="default"
                            className="bg-white/10 hover:bg-white/20 text-white"
                        >
                            Add Amenity
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AmenitiesSelector;