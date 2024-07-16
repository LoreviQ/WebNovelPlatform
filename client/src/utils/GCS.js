import { getSignedUrl } from "./api";

const uploadFileToGCS = async (file) => {
    // Request a signed URL from your backend
    const response = await getSignedUrl();
    const { signedUrl } = await response.json();

    // Upload the file using the signed URL
    const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": "image/jpeg", // Adjust based on your file type
        },
    });

    if (uploadResponse.ok) {
        return signedUrl.split("?")[0]; // Return the file URL without query parameters
    } else {
        throw new Error("Failed to upload file");
    }
};

export { uploadFileToGCS };
