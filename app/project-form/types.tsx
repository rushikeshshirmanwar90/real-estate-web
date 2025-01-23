export interface FormData {
    images: string[]
    basicInfo: {
        name: string
        description: string
    }
    address: {
        streetAddress: string
        area: string
        state: string
        city: string
    }
}

