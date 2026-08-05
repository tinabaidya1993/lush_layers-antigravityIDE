import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CakeModel } from "@/lib/models";

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");

    const query: any = {};
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(category, "i") };
    }
    if (search) {
      query.name = { $regex: new RegExp(search, "i") };
    }

    let cakeQuery = CakeModel.find(query);

    if (sort === "price-low") {
      cakeQuery = cakeQuery.sort({ price: 1 });
    } else if (sort === "price-high") {
      cakeQuery = cakeQuery.sort({ price: -1 });
    } else {
      cakeQuery = cakeQuery.sort({ createdAt: -1 });
    }

    if (limit) {
      cakeQuery = cakeQuery.limit(parseInt(limit, 10));
    }

    const cakes = await cakeQuery.exec();

    const formattedCakes = cakes.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      category: c.category,
      description: c.description,
      price: c.price,
      originalPrice: c.discountPrice,
      images: c.images,
      flavors: c.flavorOptions,
      sizes: c.sizeVariants ? c.sizeVariants.map((v) => v.size) : ["1 Kg"],
      isEggless: c.isEggless,
      isAvailable: c.isAvailable,
      isFeatured: c.isFeatured,
      createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(formattedCakes);
  } catch (error: any) {
    console.error("GET /api/cakes Error:", error);
    // Graceful fallback array if MongoDB Atlas cluster is unreachable
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newCake = await CakeModel.create({
      name: body.name,
      slug,
      category: body.category || "Signature Cakes",
      description: body.description || "",
      price: body.price,
      discountPrice: body.originalPrice,
      sizeVariants: body.sizes ? body.sizes.map((s: string) => ({ size: s, price: body.price })) : [{ size: "1 Kg", price: body.price }],
      flavorOptions: body.flavors || ["Vanilla"],
      stockStatus: body.isAvailable !== false ? "In Stock" : "Out of Stock",
      isAvailable: body.isAvailable !== false,
      images: body.images || [],
      tags: body.isFeatured ? ["Featured"] : [],
      isEggless: body.isEggless !== false,
      isFeatured: Boolean(body.isFeatured),
    });

    return NextResponse.json({
      id: newCake._id.toString(),
      name: newCake.name,
      slug: newCake.slug,
      category: newCake.category,
      price: newCake.price,
      images: newCake.images,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/cakes Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create cake" }, { status: 500 });
  }
}
