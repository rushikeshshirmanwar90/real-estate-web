import { AmenitiesProps } from "@/components/types/editable-card"

export interface FormData {
    images: string[];
    name: string;
    description: string;
    projectType: string;
    area: number;
    address: string;
    state: string;
    city: string;
    amenities: AmenitiesProps[];
    clientId: string; // Update type to accept both ObjectId and string
}