import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SlideModel } from "@/lib/models";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) return NextResponse.json([]);

    const slides = await SlideModel.find({ isActive: true }).sort({ displayOrder: 1 });

    const formatted = slides.map((s) => ({
      id: s._id.toString(),
      image: s.image,
      headline: s.headline,
      subtext: s.subtext || "",
      price: s.price !== undefined && s.price !== null ? Number(s.price) : 0,
      ctaText: s.ctaText || "Explore Menu",
      ctaLink: s.ctaLink || "/menu",
      isActive: s.isActive,
      displayOrder: s.displayOrder || 1,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET /api/slides Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const priceNum = body.price !== undefined && body.price !== "" ? parseFloat(body.price) : 0;

    const newSlide = await SlideModel.create({
      image: body.image,
      headline: body.headline,
      subtext: body.subtext || "",
      price: priceNum,
      ctaText: body.ctaText || "Explore Menu",
      ctaLink: body.ctaLink || "/menu",
      isActive: body.isActive !== false,
      displayOrder: body.displayOrder || 1,
    });

    return NextResponse.json(
      {
        id: newSlide._id.toString(),
        headline: newSlide.headline,
        subtext: newSlide.subtext || "",
        price: newSlide.price !== undefined ? Number(newSlide.price) : 0,
        ctaText: newSlide.ctaText || "Explore Menu",
        ctaLink: newSlide.ctaLink || "/menu",
        image: newSlide.image,
        isActive: newSlide.isActive,
        displayOrder: newSlide.displayOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/slides Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create slide" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, _id, ...updateFields } = body;
    const targetId = id || _id;

    if (!targetId) return NextResponse.json({ error: "Slide ID required" }, { status: 400 });

    if (updateFields.price !== undefined && updateFields.price !== null) {
      updateFields.price = updateFields.price !== "" ? parseFloat(updateFields.price) : 0;
    }

    const updated = await SlideModel.findByIdAndUpdate(targetId, updateFields, { new: true });
    return NextResponse.json({ success: true, slide: updated });
  } catch (error: any) {
    console.error("PUT /api/slides Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const ids = searchParams.get("ids")?.split(",");

    if (ids && ids.length > 0) {
      await SlideModel.deleteMany({ _id: { $in: ids } });
    } else if (id) {
      await SlideModel.findByIdAndDelete(id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/slides Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
