export interface FormData {
    images: string[]
    basicInfo: {
        name: string
        description: string,
        ProjectType: string,
        area: number,
    }
    address: {
        streetAddress: string
        area: string
        state: string
        city: string
    }
}