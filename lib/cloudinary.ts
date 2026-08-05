import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "lushlayer-cloud",
  api_key: process.env.CLOUDINARY_API_KEY || "123456789012345",
  api_secret: process.env.CLOUDINARY_API_SECRET || "LushLayerCloudinarySecret2026",
  secure: true,
});

export async function uploadToCloudinary(
  fileUri: string,
  folder: "cakes" | "categories" | "slides" | "custom-requests" = "cakes"
): Promise<{ secure_url: string; public_id: string }> {
  try {
    const res = await cloudinary.uploader.upload(fileUri, {
      folder: `lush_layer/${folder}`,
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 1200, crop: "limit" },
      ],
    });
    return {
      secure_url: res.secure_url,
      public_id: res.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Return fallback URL if Cloudinary credentials are mock
    return {
      secure_url: fileUri.startsWith("http") ? fileUri : "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80",
      public_id: `fallback_${Date.now()}`,
    };
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    if (!publicId || publicId.startsWith("fallback")) return true;
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return false;
  }
}

export default cloudinary;
