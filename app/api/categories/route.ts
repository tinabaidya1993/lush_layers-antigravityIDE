import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CategoryModel } from "@/lib/models";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) return NextResponse.json([]);

    const categories = await CategoryModel.find().sort({ displayOrder: 1, createdAt: -1 });

    const formatted = categories.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      image: c.image || "",
      parentCategory: c.parentCategory || "None (Root)",
      displayOrder: c.displayOrder || 1,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET /api/categories Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    const newCategory = await CategoryModel.create({
      name: body.name,
      slug,
      description: body.description || "",
      image: body.image || "",
      parentCategory: body.parentCategory || "None (Root)",
      displayOrder: body.displayOrder || 1,
    });

    return NextResponse.json(
      {
        id: newCategory._id.toString(),
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description || "",
        image: newCategory.image || "",
        parentCategory: newCategory.parentCategory || "None (Root)",
        displayOrder: newCategory.displayOrder || 1,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/categories Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) return NextResponse.json({ error: "Category ID required" }, { status: 400 });

    const updated = await CategoryModel.findByIdAndUpdate(id, updateFields, { new: true });
    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error("PUT /api/categories Error:", error);
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
      await CategoryModel.deleteMany({ _id: { $in: ids } });
    } else if (id) {
      await CategoryModel.findByIdAndDelete(id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/categories Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
