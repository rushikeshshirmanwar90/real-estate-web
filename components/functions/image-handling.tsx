export const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>, form: any) => {
    if (!e.target.files?.length) return;
    setIsLoading(true);
    const uploadedFiles = Array.from(e.target.files);
    const uploadPromises = uploadedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'realEstate');

        console.log("Uploading file:", file);
        console.log("FormData:", [...formData.entries()]);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dlcq8i2sc/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Cloudinary error:', errorData);
                return null;
            }
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Upload failed:', error);
            return null;
        }
    });

    const urls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
    setUploadedImages((prev: any) => [...prev, ...urls]);
    const currentImages = form.getValues('images') || [];
    form.setValue('images', [...currentImages, ...urls]);
    setIsLoading(false);
};

export const removeImage = (index: number, form: any, setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    const currentImages = form.getValues('images') || []
    form.setValue(
        'images',
        currentImages.filter((_: any, i: any) => i !== index)
    )
}