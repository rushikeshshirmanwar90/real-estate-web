
export interface Section {
    name: string;
    description?: string;
    images?: string[];
}

export interface FlatInfo {
    title: string;
    description?: string;
    images: string[];
    totalFlats: number;
    totalBookedFlats: number;
    totalArea: number;
    video?: string;
}

export interface Amenity {
    icon: string;
    name: string;
}

export interface BuildingFormProps {
    name: string;
    description?: string;
    projectId: string;
    area: number;
    images: string[];
    amenities?: Amenity[];
    section?: Section[];
    flatInfo?: FlatInfo[];
}