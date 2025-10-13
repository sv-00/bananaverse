// utils/fileUtils.ts
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (file.size > 800000) {
            reject(new Error("Image size exceeds 800KB. Please select a smaller image."));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};