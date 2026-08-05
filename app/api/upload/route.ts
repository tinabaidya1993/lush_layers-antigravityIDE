import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { image, folder } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image file or URL provided" }, { status: 400 });
    }

    const targetFolder = (folder as "cakes" | "categories" | "slides" | "custom-requests") || "cakes";
    const uploadResult = await uploadToCloudinary(image, targetFolder);

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message || "Image upload failed" }, { status: 500 });
  }
}
