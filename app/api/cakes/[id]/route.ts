import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { CakeModel } from "@/lib/models";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const updated = await CakeModel.findByIdAndUpdate(
      id,
      {
        ...(body.name ? { name: body.name, slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") } : {}),
        ...(body.category ? { category: body.category } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.price !== undefined ? { price: body.price } : {}),
        ...(body.isAvailable !== undefined ? { isAvailable: body.isAvailable, stockStatus: body.isAvailable ? "In Stock" : "Out of Stock" } : {}),
        ...(body.images ? { images: body.images } : {}),
        ...(body.isEggless !== undefined ? { isEggless: body.isEggless } : {}),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Cake not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/menu");

    return NextResponse.json({ success: true, cake: updated });
  } catch (error: any) {
    console.error("PUT /api/cakes/[id] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update cake" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await CakeModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Cake not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/menu");

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("DELETE /api/cakes/[id] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete cake" }, { status: 500 });
  }
}
