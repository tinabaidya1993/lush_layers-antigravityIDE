import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AddonModel } from "@/lib/models";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const query: any = {};
    if (type) query.type = type;

    const addons = await AddonModel.find(query).sort({ createdAt: -1 });

    const formatted = addons.map((a) => ({
      id: a._id.toString(),
      type: a.type,
      name: a.name,
      price: a.price || 0,
      image: a.image || "",
      isAvailable: a.isAvailable !== false,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET /api/addons Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newAddon = await AddonModel.create({
      type: body.type || "extra",
      name: body.name,
      price: body.price || 0,
      image: body.image || "",
      isAvailable: body.isAvailable !== false,
    });

    return NextResponse.json(
      {
        id: newAddon._id.toString(),
        type: newAddon.type,
        name: newAddon.name,
        price: newAddon.price || 0,
        image: newAddon.image || "",
        isAvailable: newAddon.isAvailable,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/addons Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create addon" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) return NextResponse.json({ error: "Addon ID required" }, { status: 400 });

    const updated = await AddonModel.findByIdAndUpdate(id, updateFields, { new: true });
    return NextResponse.json({ success: true, addon: updated });
  } catch (error: any) {
    console.error("PUT /api/addons Error:", error);
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
      await AddonModel.deleteMany({ _id: { $in: ids } });
    } else if (id) {
      await AddonModel.findByIdAndDelete(id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/addons Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
